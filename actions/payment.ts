"use server";

import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  IBooking,
  ICreateCheckoutPayload,
  ICreateCheckoutResult,
} from "@/interfaces";
import {
  validateTicketsAndCalculateTotal,
  createBookingWithTickets,
  buildStripeLineItems,
  createStripeSession,
  findBookingBySession,
  markBookingConfirmed,
  decrementInventoryForTickets,
  getStripeSessionStatus,
  findBookingBySessionForUser,
  cancelPendingBookingBySession,
} from "@/lib/booking-helpers";

// Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

/**
 * Create a Stripe Checkout Session for event booking
 * @param bookingData - Booking information including tickets
 * @returns Stripe Checkout Session URL or error
 */
export const createCheckoutSession = async (
  payload: ICreateCheckoutPayload,
): Promise<ICreateCheckoutResult> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Parallel fetching: fetch event and validate tickets simultaneously
    const [eventResult, validationResult] = await Promise.all([
      supabase.from("events").select("*").eq("id", payload.eventId).single(),
      validateTicketsAndCalculateTotal(
        supabase,
        payload.eventId,
        payload.tickets,
      ),
    ]);

    // Early exit: event not found
    const { data: event, error: eventError } = eventResult;
    if (eventError || !event) {
      return { success: false, message: "Event not found" };
    }

    // Early exit: validation failed
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.message || "Validation failed",
      };
    }

    const { ticketDetails, totalAmount } = validationResult;
    if (!ticketDetails || !totalAmount) {
      return { success: false, message: "Invalid ticket details" };
    }

    // Create booking with tickets
    const bookingResult = await createBookingWithTickets(supabase, {
      eventId: payload.eventId,
      userId: user.id,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      totalAmount,
      ticketDetails,
    });

    if (!bookingResult.success || !bookingResult.booking) {
      return {
        success: false,
        message: bookingResult.message || "Failed to create booking",
      };
    }

    const { booking } = bookingResult;

    // Build Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const ensureAbsolute = (u: string) => {
      if (/^https?:\/\//i.test(u)) return u;
      return `${baseUrl.replace(/\/$/, "")}/${u.replace(/^\//, "")}`;
    };

    const lineItems = await buildStripeLineItems(event, ticketDetails, baseUrl);
    const successUrl = ensureAbsolute(
      `/user/bookings?session_id={CHECKOUT_SESSION_ID}`,
    );
    const cancelUrl = ensureAbsolute(`/user/events/${payload.eventId}`);

    const stripeResult = await createStripeSession(stripe, {
      lineItems,
      successUrl,
      cancelUrl,
      customerEmail: payload.customerEmail,
      bookingId: booking.id,
      eventId: payload.eventId,
      userId: user.id,
    });

    if (!stripeResult.success || !stripeResult.session) {
      // Rollback booking on Stripe failure
      await supabase.from("bookings").delete().eq("id", booking.id);
      return {
        success: false,
        message: stripeResult.message || "Failed to create checkout session",
      };
    }

    // Update booking with Stripe session ID
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ stripe_session_id: stripeResult.session.id })
      .eq("id", booking.id);

    if (updateError) {
      console.error("Failed to update booking with session ID:", updateError);
    }

    return {
      success: true,
      message: "Checkout session created",
      sessionUrl: stripeResult.session.url!,
      bookingId: booking.id,
    };
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create checkout session",
    };
  }
};

/**
 * Confirm booking payment after successful Stripe webhook
 * Called by webhook handler only
 * Refactored with separated helpers for better testability
 */
export const confirmBookingPayment = async (
  sessionId: string,
  paymentIntentId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Use service-role client for webhook context (bypass RLS)
    const supabase = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Find booking by session ID
    const bookingResult = await findBookingBySession(supabase, sessionId);

    // Early exit: booking not found
    if (!bookingResult.success || !bookingResult.booking) {
      return {
        success: false,
        message: bookingResult.message || "Booking not found",
      };
    }

    const { booking } = bookingResult;

    // Early exit: already confirmed (idempotent)
    if (booking.status === "confirmed") {
      return { success: true, message: "Booking already confirmed" };
    }

    // Mark booking as confirmed
    const confirmResult = await markBookingConfirmed(
      supabase,
      booking.id,
      paymentIntentId,
    );

    if (!confirmResult.success) {
      return {
        success: false,
        message: confirmResult.message || "Failed to confirm booking",
      };
    }

    // Update ticket inventory (logs errors but doesn't fail)
    await decrementInventoryForTickets(
      supabase,
      booking.booking_tickets as Array<{
        ticket_type_id: string;
        quantity: number;
      }>,
    );

    return { success: true, message: "Payment confirmed successfully" };
  } catch (error: unknown) {
    console.error("Error confirming payment:", error);
    return { success: false, message: "Failed to confirm payment" };
  }
};

/**
 * Verify payment status after redirect from Stripe
 * Used on success page to check payment completion
 * Refactored with parallel fetching for better performance
 */
export const verifyPaymentStatus = async (
  sessionId: string,
): Promise<{ success: boolean; message: string; booking?: IBooking }> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Early exit: unauthorized
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Parallel fetching: Stripe session and booking simultaneously
    const [stripeResult, bookingResult] = await Promise.all([
      getStripeSessionStatus(stripe, sessionId),
      findBookingBySessionForUser(supabase, sessionId, user.id),
    ]);

    // Early exit: Stripe session not retrieved
    if (!stripeResult.success || !stripeResult.isPaid) {
      return {
        success: false,
        message:
          stripeResult.isPaid === false
            ? "Payment not completed"
            : "Failed to verify payment status",
      };
    }

    // Early exit: booking not found
    if (!bookingResult.success || !bookingResult.booking) {
      return {
        success: false,
        message: bookingResult.message || "Booking not found",
      };
    }

    const { booking } = bookingResult;

    return {
      success: true,
      message:
        booking.status === "confirmed"
          ? "Payment confirmed"
          : "Payment processing",
      booking: booking as unknown as IBooking,
    };
  } catch (error: unknown) {
    console.error("Error verifying payment:", error);
    return { success: false, message: "Failed to verify payment status" };
  }
};

/**
 * Cancel booking if payment session expires or is cancelled
 * Refactored with extracted helper for consistency
 */
export const cancelBookingPayment = async (
  sessionId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Use service-role client for webhook context (bypass RLS)
    const supabase = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Cancel pending booking by session ID
    const result = await cancelPendingBookingBySession(supabase, sessionId);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to cancel booking",
      };
    }

    return { success: true, message: "Booking cancelled" };
  } catch (error: unknown) {
    console.error("Error cancelling booking:", error);
    return { success: false, message: "Failed to cancel booking" };
  }
};
