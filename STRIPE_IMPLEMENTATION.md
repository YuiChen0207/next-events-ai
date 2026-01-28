# Stripe Payment Integration - Implementation Guide

## ✅ Completed Steps

### 1. ✅ Installed Stripe SDK
```bash
npm install stripe
```

### 2. ✅ Created Payment Actions
- **File**: `actions/payment.ts`
- **Functions**:
  - `createCheckoutSession` - Creates pending booking and Stripe session
  - `confirmBookingPayment` - Webhook handler to confirm booking after payment
  - `verifyPaymentStatus` - Verify payment status after redirect
  - `cancelBookingPayment` - Cancel booking if payment expires

### 3. ✅ Updated TypeScript Interfaces
- **File**: `interfaces/index.ts`
- **Changes**: Added `stripe_session_id` and `payment_intent_id` to `IBooking`

### 4. ✅ Created Stripe Webhook Handler
- **File**: `app/api/stripe/webhook/route.ts`
- **Events Handled**:
  - `checkout.session.completed` - Confirms booking
  - `checkout.session.expired` - Cancels booking
  - `payment_intent.payment_failed` - Logs failures

### 5. ✅ Updated Booking Modal
- **File**: `app/(private)/user/events/[id]/_components/booking-modal.tsx`
- **Changes**: Switched from `createBooking` to `createCheckoutSession`

### 6. ✅ Updated Confirmation Step
- **File**: `app/(private)/user/events/[id]/_components/booking-step-confirm.tsx`
- **Changes**: Updated messaging to indicate Stripe redirect

### 7. ✅ Created Environment Variables Template
- **File**: `.env.local.example`
- **Required Variables**: Stripe keys, webhook secret, app URL

---

## 🚀 Next Steps (Manual Setup Required)

### Step 1: Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Stripe test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys):
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`

3. Set your application URL:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Keep `STRIPE_WEBHOOK_SECRET` blank for now (we'll get it in Step 3)

### Step 2: Update Database Schema
Run the SQL migration in your Supabase SQL Editor:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project → SQL Editor
3. Copy content from `supabase-migration-stripe.sql`
4. Execute the SQL

This will:
- Add `stripe_session_id` and `payment_intent_id` columns to `bookings` table
- Create indexes for faster lookups
- Create `decrement_ticket_quantity` RPC function

### Step 3: Set Up Stripe Webhook (Local Development)
1. Install Stripe CLI:
   ```bash
   # Windows (using Scoop)
   scoop install stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Keep the `stripe listen` command running in a separate terminal while testing

### Step 4: Test Payment Flow
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to an event and click "Book Now"

3. Select tickets and fill in customer information

4. On the confirmation page, click "Confirm & Pay"

5. You'll be redirected to Stripe Checkout page

6. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0027 6000 3184`
   - Use any future expiry date (e.g., 12/34)
   - Use any 3-digit CVC

7. After successful payment, you'll be redirected back to your bookings page

8. Check the webhook terminal to see the `checkout.session.completed` event

9. Verify in Supabase that:
   - Booking status changed from `pending` to `confirmed`
   - `stripe_session_id` and `payment_intent_id` are populated
   - Ticket inventory decreased

---

## 🧪 Testing Checklist

### Payment Success Flow
- [ ] Booking created with status `pending`
- [ ] Redirected to Stripe Checkout
- [ ] Payment with test card successful
- [ ] Webhook received `checkout.session.completed`
- [ ] Booking status updated to `confirmed`
- [ ] Ticket inventory decreased
- [ ] User redirected to bookings page

### Payment Failure Flow
- [ ] Booking created with status `pending`
- [ ] Payment declined with test card
- [ ] User sees error message
- [ ] Booking remains `pending`
- [ ] Can retry payment (session valid for 30 minutes)

### Session Expiry Flow
- [ ] After 30 minutes, Stripe session expires
- [ ] Webhook receives `checkout.session.expired`
- [ ] Booking status updated to `cancelled`
- [ ] Ticket inventory not affected

### Edge Cases
- [ ] Multiple tickets of different types
- [ ] Insufficient ticket availability
- [ ] Invalid event ID
- [ ] Webhook signature verification
- [ ] Duplicate webhook events (idempotency)

---

## 📝 Implementation Details

### Payment Flow Architecture
```
User Selects Tickets
    ↓
Fill Customer Info
    ↓
Click "Confirm & Pay"
    ↓
createCheckoutSession() Server Action
    - Validates tickets
    - Creates pending booking
    - Creates Stripe session
    ↓
Redirect to Stripe Checkout
    ↓
User Completes Payment
    ↓
Stripe Webhook Fired
    ↓
confirmBookingPayment() Server Action
    - Updates booking to confirmed
    - Decrements ticket inventory
    ↓
User Redirected to Bookings Page
```

### Currency
- Default: **TWD (Taiwan Dollar)**
- Change in `actions/payment.ts` line 119: `currency: "twd"`

### Session Expiry
- Default: **30 minutes**
- Change in `actions/payment.ts` line 134: `expires_at`

### Redirect URLs
- **Success**: `/user/bookings?session_id={CHECKOUT_SESSION_ID}`
- **Cancel**: `/user/events/{eventId}`

---

## 🔒 Security Considerations

1. **Webhook Signature Verification**: Always verify webhook signatures to prevent spoofing
2. **Server-Side Validation**: All payment confirmations happen server-side via webhooks
3. **Idempotency**: Stripe webhooks may send duplicate events - handle gracefully
4. **Environment Variables**: Never commit `.env.local` to version control
5. **Test Mode**: Always use test keys (`sk_test_` and `pk_test_`) during development

---

## 🌐 Production Deployment

### Before Going Live
1. Switch to live mode API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Configure production webhook endpoint:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `checkout.session.expired`
   - Copy the webhook signing secret to production environment variables

3. Update environment variables:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (from production webhook)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. Test thoroughly with live mode test cards before accepting real payments

---

## 📚 Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

---

## ❓ Troubleshooting

### Webhook Not Received
- Ensure `stripe listen` is running
- Check firewall settings
- Verify webhook secret in `.env.local`

### Payment Not Confirming
- Check webhook logs in Stripe CLI
- Verify `decrement_ticket_quantity` function exists in Supabase
- Check booking status in database

### Redirect Loop
- Ensure `NEXT_PUBLIC_APP_URL` matches your local server
- Check success/cancel URLs in checkout session

### TypeScript Errors
- Run `npm run typecheck` to identify issues
- Ensure all interfaces are updated

---

## ✨ Features Implemented

- ✅ Stripe Checkout integration with latest API (2024-12-18)
- ✅ Pending → Confirmed booking flow
- ✅ Webhook-based payment confirmation
- ✅ Automatic ticket inventory management
- ✅ Session expiry handling (30 minutes)
- ✅ Multiple ticket types support
- ✅ TypeScript strict mode compliance
- ✅ Error handling and validation
- ✅ Test mode ready

Happy coding! 🎉
