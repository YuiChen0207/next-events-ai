-- PostgreSQL RPC Function for Admin Bookings with Full Details
-- This function returns all bookings with nested user, event, and ticket data
-- Pre-formatted as JSONB to eliminate application-layer transformation

CREATE OR REPLACE FUNCTION get_all_bookings_for_admin_with_details()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', b.id,
      'created_at', b.created_at,
      'event_id', b.event_id,
      'user_id', b.user_id,
      'customer_name', b.customer_name,
      'customer_email', b.customer_email,
      'customer_phone', b.customer_phone,
      'total_amount', b.total_amount,
      'status', b.status,
      'stripe_session_id', b.stripe_session_id,
      'payment_intent_id', b.payment_intent_id,
      'user', jsonb_build_object(
        'name', COALESCE(up.name, 'Unknown User'),
        'email', COALESCE(up.email, ''),
        'role', COALESCE(up.role, 'user')
      ),
      'event', jsonb_build_object(
        'title', COALESCE(e.title, 'Unknown Event'),
        'date', COALESCE(e.date::text, ''),
        'start_time', COALESCE(e.start_time::text, ''),
        'end_time', COALESCE(e.end_time::text, ''),
        'location', e.location
      ),
      'tickets', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', bt.id,
              'quantity', bt.quantity,
              'price_per_ticket', bt.price_per_ticket,
              'subtotal', bt.subtotal,
              'ticket_type', jsonb_build_object(
                'name', COALESCE(ett.name, 'Unknown')
              )
            )
          )
          FROM booking_tickets bt
          LEFT JOIN events_ticket_types ett ON bt.ticket_type_id = ett.id
          WHERE bt.booking_id = b.id
        ),
        '[]'::jsonb
      )
    )
    ORDER BY b.created_at DESC
  ), '[]'::jsonb)
  INTO result
  FROM bookings b
  LEFT JOIN "user-profiles" up ON b.user_id = up.user_id
  LEFT JOIN events e ON b.event_id = e.id;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
-- (Admin role verification will be done in the application layer)
GRANT EXECUTE ON FUNCTION get_all_bookings_for_admin_with_details() TO authenticated;

-- Example usage:
-- SELECT get_all_bookings_for_admin_with_details();
