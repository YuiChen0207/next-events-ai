# Stripe Payment Integration - Quick Reference

## 🎯 What Was Implemented

Stripe payment gateway integration for event ticket bookings with:

- Secure checkout flow using Stripe Checkout
- Webhook-based payment confirmation
- Automatic ticket inventory management
- Test mode configuration

---

## 📁 Files Created/Modified

### Created Files

1. **`actions/payment.ts`** (350+ lines)
   - `createCheckoutSession()` - Creates Stripe session and pending booking
   - `confirmBookingPayment()` - Confirms booking after webhook
   - `verifyPaymentStatus()` - Verifies payment on redirect
   - `cancelBookingPayment()` - Cancels expired bookings

2. **`app/api/stripe/webhook/route.ts`**
   - POST handler for Stripe webhooks
   - Handles: `checkout.session.completed`, `checkout.session.expired`

3. **`supabase-migration-stripe.sql`**
   - Adds `stripe_session_id` and `payment_intent_id` columns
   - Creates indexes and RPC function

4. **`.env.local.example`**
   - Template for environment variables

5. **`STRIPE_IMPLEMENTATION.md`**
   - Complete implementation guide with testing instructions

### Modified Files

1. **`interfaces/index.ts`**
   - Added `stripe_session_id?: string` to `IBooking`
   - Added `payment_intent_id?: string` to `IBooking`

2. **`app/(private)/user/events/[id]/_components/booking-modal.tsx`**
   - Changed from `createBooking` to `createCheckoutSession`
   - Redirects to Stripe instead of direct booking

3. **`app/(private)/user/events/[id]/_components/booking-step-confirm.tsx`**
   - Updated messaging about Stripe redirect

---

## ⚡ Quick Start

### 1. Set Up Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local and add your Stripe test keys from:
# https://dashboard.stripe.com/test/apikeys
```

### 2. Run Database Migration

- Go to Supabase SQL Editor
- Run `supabase-migration-stripe.sql`

### 3. Start Stripe Webhook Listener

```bash
# Install Stripe CLI first: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook secret (whsec_...) to .env.local
```

### 4. Test Payment

```bash
npm run dev
# Navigate to an event → Book Now → Select tickets → Pay
# Use test card: 4242 4242 4242 4242
```

---

## 🧪 Test Cards

| Card Number           | Result       |
| --------------------- | ------------ |
| `4242 4242 4242 4242` | ✅ Success   |
| `4000 0000 0000 0002` | ❌ Decline   |
| `4000 0027 6000 3184` | 🔒 3D Secure |

Use any future expiry (e.g., 12/34) and any 3-digit CVC.

---

## 🔄 Payment Flow

```
1. User selects tickets
2. Fills customer info
3. Clicks "Confirm & Pay"
4. Server creates pending booking
5. User redirected to Stripe Checkout
6. User pays with card
7. Stripe webhook fires
8. Server confirms booking
9. Inventory updated
10. User redirected to bookings page
```

---

## 🛠️ Environment Variables Required

```env
# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Database Changes

**Table: `bookings`**

- Added: `stripe_session_id` (TEXT, nullable)
- Added: `payment_intent_id` (TEXT, nullable)

**Function: `decrement_ticket_quantity()`**

- Updates `available_tickets` and `booked_tickets`

---

## 🚨 Important Notes

1. **Webhook Required**: Payment confirmation happens via webhook, not client-side
2. **Keep Stripe CLI Running**: `stripe listen` must be active during testing
3. **30-Minute Expiry**: Checkout sessions expire after 30 minutes
4. **Test Mode Only**: All keys are for testing - switch to live keys for production
5. **Currency**: Currently set to TWD (Taiwan Dollar)

---

## 📝 Next Manual Steps

1. [ ] Copy `.env.local.example` to `.env.local`
2. [ ] Add Stripe test keys to `.env.local`
3. [ ] Run SQL migration in Supabase
4. [ ] Install Stripe CLI: `scoop install stripe`
5. [ ] Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
6. [ ] Copy webhook secret to `.env.local`
7. [ ] Test payment with card `4242 4242 4242 4242`

---

## 📖 Documentation

See [STRIPE_IMPLEMENTATION.md](STRIPE_IMPLEMENTATION.md) for:

- Detailed setup guide
- Testing checklist
- Production deployment steps
- Troubleshooting tips
- Security considerations

---

## ✅ Implementation Status

All code is complete and ready for testing! Just need to:

1. Configure environment variables
2. Run database migration
3. Set up webhook forwarding
4. Test the flow

**Total Time Estimate**: ~15 minutes for setup and testing 🚀
