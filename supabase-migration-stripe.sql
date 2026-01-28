-- Add Stripe payment fields to bookings table
ALTER TABLE bookings 
ADD COLUMN stripe_session_id TEXT,
ADD COLUMN payment_intent_id TEXT;

-- Add indexes for faster lookups
CREATE INDEX idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX idx_bookings_payment_intent_id ON bookings(payment_intent_id);

-- Create RPC function to decrement ticket quantity (if not exists)
CREATE OR REPLACE FUNCTION decrement_ticket_quantity(
  ticket_type_id UUID,
  decrement_by INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE event_ticket_types
  SET available_tickets = available_tickets - decrement_by,
      booked_tickets = booked_tickets + decrement_by
  WHERE id = ticket_type_id;
END;
$$ LANGUAGE plpgsql;
