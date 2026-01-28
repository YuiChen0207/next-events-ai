import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { confirmBookingPayment, cancelBookingPayment } from "@/actions/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);

        // Confirm the booking payment
        if (session.payment_status === "paid" && session.payment_intent) {
          const result = await confirmBookingPayment(
            session.id,
            session.payment_intent as string
          );

          if (!result.success) {
            console.error("Failed to confirm booking:", result.message);
            // Don't return error to Stripe - log and investigate
          } else {
            console.log("Booking confirmed successfully:", result.message);
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session expired:", session.id);

        // Cancel the booking
        const result = await cancelBookingPayment(session.id);
        if (!result.success) {
          console.error("Failed to cancel expired booking:", result.message);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        // Handle payment failure if needed
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
