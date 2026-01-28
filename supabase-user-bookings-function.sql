-- SQL Function to get user confirmed bookings with all details pre-formatted
-- This eliminates the need for data transformation in the application layer

CREATE OR REPLACE FUNCTION get_user_confirmed_bookings_with_details(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  event_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount NUMERIC,
  status TEXT,
  stripe_session_id TEXT,
  payment_intent_id TEXT,
  event JSONB,
  tickets JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.created_at,
    b.event_id,
    b.customer_name,
    b.customer_email,
    b.customer_phone,
    b.total_amount,
    b.status,
    b.stripe_session_id,
    b.payment_intent_id,
    -- Build event object with COALESCE for defaults
    jsonb_build_object(
      'title', COALESCE(e.title, 'Unknown Event'),
      'date', COALESCE(e.date::text, ''),
      'start_time', COALESCE(e.start_time::text, ''),
      'end_time', COALESCE(e.end_time::text, ''),
      'location', e.location,
      'images', e.images
    ) AS event,
    -- Build tickets array with nested ticket_type
    COALESCE(
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
    ) AS tickets
  FROM bookings b
  LEFT JOIN events e ON b.event_id = e.id
  WHERE b.user_id = p_user_id
    AND b.status = 'confirmed'
  ORDER BY b.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_confirmed_bookings_with_details(UUID) TO authenticated;

-- Example usage:
-- SELECT * FROM get_user_confirmed_bookings_with_details('user-uuid-here');
