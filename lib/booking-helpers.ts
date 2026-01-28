"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { IEvent, IEventTicketType, ICreateCheckoutTicket } from "@/interfaces";

/**
 * Validate ticket availability and calculate total amount
 * Applies early-exit pattern for performance
 */
export async function validateTicketsAndCalculateTotal(
  supabase: SupabaseClient,
  eventId: string,
  tickets: ICreateCheckoutTicket[],
): Promise<{
  success: boolean;
  message?: string;
  ticketDetails?: Array<{ ticketType: IEventTicketType; quantity: number }>;
  totalAmount?: number;
}> {
  // Early exit: validate tickets array
  if (!tickets || tickets.length === 0) {
    return { success: false, message: "Please select at least one ticket" };
  }

  // Fetch ticket types
  const ticketTypeIds = tickets.map((t) => t.ticketTypeId);
  const { data: ticketTypes, error: ticketTypesError } = await supabase
    .from("events_ticket_types")
    .select("*")
    .in("id", ticketTypeIds)
    .eq("event_id", eventId);

  if (ticketTypesError || !ticketTypes || ticketTypes.length === 0) {
    return { success: false, message: "Invalid ticket types" };
  }

  // Validate each ticket and calculate total
  let totalAmount = 0;
  const ticketDetails: Array<{
    ticketType: IEventTicketType;
    quantity: number;
  }> = [];

  for (const ticket of tickets) {
    const ticketType = ticketTypes.find((tt) => tt.id === ticket.ticketTypeId);

    // Early exit: ticket type not found
    if (!ticketType) {
      return {
        success: false,
        message: `Ticket type ${ticket.ticketTypeId} not found`,
      };
    }

    // Early exit: insufficient tickets
    const available = Number(ticketType.available_tickets ?? 0);
    if (available < ticket.quantity) {
      return {
        success: false,
        message: `Insufficient tickets for ${ticketType.name}. Available: ${available}`,
      };
    }

    // Early exit: invalid quantity
    if (ticket.quantity <= 0) {
      return {
        success: false,
        message: "Ticket quantity must be greater than 0",
      };
    }

    totalAmount += ticketType.price * ticket.quantity;
    ticketDetails.push({ ticketType, quantity: ticket.quantity });
  }

  // Early exit: invalid total
  if (totalAmount <= 0) {
    return { success: false, message: "Invalid booking amount" };
  }

  return { success: true, ticketDetails, totalAmount };
}

/**
 * Create booking and booking tickets in database
 * Handles transaction-like operations with rollback on error
 */
export async function createBookingWithTickets(
  supabase: SupabaseClient,
  data: {
    eventId: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    ticketDetails: Array<{ ticketType: IEventTicketType; quantity: number }>;
  },
): Promise<{
  success: boolean;
  message?: string;
  booking?: { id: string; [key: string]: unknown };
}> {
  // Create pending booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      event_id: data.eventId,
      user_id: data.userId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      total_amount: data.totalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (bookingError || !booking) {
    console.error("Failed to create booking:", bookingError);
    return { success: false, message: "Failed to create booking" };
  }

  // Create booking tickets
  const bookingTickets = data.ticketDetails.map((td) => ({
    booking_id: booking.id,
    ticket_type_id: td.ticketType.id,
    quantity: td.quantity,
    price_per_ticket: td.ticketType.price,
    subtotal: td.ticketType.price * td.quantity,
  }));

  const { error: ticketsError } = await supabase
    .from("booking_tickets")
    .insert(bookingTickets);

  if (ticketsError) {
    console.error("Failed to create booking tickets:", ticketsError);
    // Rollback: delete booking
    await supabase.from("bookings").delete().eq("id", booking.id);
    return { success: false, message: "Failed to create booking tickets" };
  }

  return { success: true, booking };
}

/**
 * Build Stripe Checkout Session line items
 * Extracted for testability and reusability
 */
export async function buildStripeLineItems(
  event: IEvent,
  ticketDetails: Array<{ ticketType: IEventTicketType; quantity: number }>,
  baseUrl: string,
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  const ensureAbsolute = (u: unknown) => {
    if (!u || typeof u !== "string") return undefined;
    if (/^https?:\/\//i.test(u)) return u;
    return `${baseUrl.replace(/\/$/, "")}/${u.replace(/^\//, "")}`;
  };

  return ticketDetails.map((td) => ({
    price_data: {
      currency: "twd",
      product_data: {
        name: `${event.title} - ${td.ticketType.name}`,
        images: (() => {
          const imgs =
            event.images && Array.isArray(event.images) ? event.images : [];
          const first = imgs.length > 0 ? ensureAbsolute(imgs[0]) : undefined;
          return first ? [first] : undefined;
        })(),
      },
      unit_amount: Math.round(td.ticketType.price * 100),
    },
    quantity: td.quantity,
  }));
}

/**
 * Create Stripe Checkout Session
 * Separated for cleaner payment logic
 */
export async function createStripeSession(
  stripe: Stripe,
  data: {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    successUrl: string;
    cancelUrl: string;
    customerEmail: string;
    bookingId: string;
    eventId: string;
    userId: string;
  },
): Promise<{
  success: boolean;
  message?: string;
  session?: Stripe.Checkout.Session;
}> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: data.lineItems,
      mode: "payment",
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,
      metadata: {
        booking_id: data.bookingId.toString(),
        event_id: data.eventId.toString(),
        user_id: data.userId,
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return { success: true, session };
  } catch (error) {
    console.error("Failed to create Stripe session:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create Stripe session",
    };
  }
}

/**
 * Find booking by Stripe session ID (webhook context with service-role client)
 * Applies early-exit pattern
 */
export async function findBookingBySession(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<{
  success: boolean;
  message?: string;
  booking?: {
    id: string;
    status: string;
    booking_tickets: unknown[];
    [key: string]: unknown;
  };
}> {
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*, booking_tickets(*)")
    .eq("stripe_session_id", sessionId)
    .single();

  if (bookingError || !booking) {
    return { success: false, message: "Booking not found" };
  }

  return { success: true, booking };
}

/**
 * Mark booking as confirmed with payment intent ID
 * Idempotent - returns success if already confirmed
 */
export async function markBookingConfirmed(
  supabase: SupabaseClient,
  bookingId: string,
  paymentIntentId: string,
): Promise<{ success: boolean; message?: string }> {
  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      payment_intent_id: paymentIntentId,
    })
    .eq("id", bookingId);

  if (updateError) {
    console.error("Failed to confirm booking:", updateError);
    return { success: false, message: "Failed to confirm booking" };
  }

  return { success: true };
}

/**
 * Decrement ticket inventory for booking tickets using RPC
 * Continues on error (logs but doesn't fail entire operation)
 */
export async function decrementInventoryForTickets(
  supabase: SupabaseClient,
  bookingTickets: Array<{ ticket_type_id: string; quantity: number }>,
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  for (const ticket of bookingTickets) {
    const { error: inventoryError } = await supabase.rpc(
      "decrement_ticket_quantity",
      {
        ticket_type_id: ticket.ticket_type_id,
        decrement_by: ticket.quantity,
      },
    );

    if (inventoryError) {
      const errorMsg = `Failed to update inventory for ticket ${ticket.ticket_type_id}`;
      console.error(errorMsg, inventoryError);
      errors.push(errorMsg);
    }
  }

  return { success: errors.length === 0, errors };
}

/**
 * Get Stripe session status
 * Extracted for parallel fetching pattern
 */
export async function getStripeSessionStatus(
  stripe: Stripe,
  sessionId: string,
): Promise<{
  success: boolean;
  message?: string;
  session?: Stripe.Checkout.Session;
  isPaid?: boolean;
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      success: true,
      session,
      isPaid: session.payment_status === "paid",
    };
  } catch (error) {
    console.error("Failed to retrieve Stripe session:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve session",
    };
  }
}

/**
 * Find booking by session ID for specific user (with RLS)
 * Used in user-facing verify flow
 */
export async function findBookingBySessionForUser(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
): Promise<{
  success: boolean;
  message?: string;
  booking?: { id: string; status: string; [key: string]: unknown };
}> {
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .eq("user_id", userId)
    .single();

  if (bookingError || !booking) {
    return { success: false, message: "Booking not found" };
  }

  return { success: true, booking };
}

/**
 * Cancel pending booking by session ID
 * Only cancels if status is pending (idempotent)
 */
export async function cancelPendingBookingBySession(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<{ success: boolean; message?: string }> {
  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("stripe_session_id", sessionId)
    .eq("status", "pending");

  if (updateError) {
    console.error("Failed to cancel booking:", updateError);
    return { success: false, message: "Failed to cancel booking" };
  }

  return { success: true };
}
