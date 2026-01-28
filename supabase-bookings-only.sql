-- ============================================
-- Bookings & Related Tables
-- ============================================
-- 創建訂單相關表格（包含票種表）
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Event Ticket Types Table (票種表)
-- ============================================
-- Note: your project already has `events_ticket_types`.
-- If a stray `event_ticket_types` table exists, drop it so we use the existing one.
DROP TABLE IF EXISTS event_ticket_types CASCADE;

-- We will use the existing `events_ticket_types` table provided by your project.
-- Ensure an index exists on `events_ticket_types(event_id)` (create if missing):
CREATE INDEX IF NOT EXISTS idx_events_ticket_types_event_id ON events_ticket_types(event_id);

-- Ensure Row Level Security is enabled on your existing table (no-op if already enabled):
ALTER TABLE IF EXISTS events_ticket_types ENABLE ROW LEVEL SECURITY;

-- The project-level RLS policies for `events_ticket_types` are left unchanged
-- (do not recreate them here to avoid collisions with existing policies).

-- ============================================
-- 2. Bookings Table (訂單表)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  stripe_session_id TEXT,
  payment_intent_id TEXT,
  CONSTRAINT check_email_format CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id ON bookings(payment_intent_id);

-- ============================================
-- 3. Booking Tickets Table (訂單票券明細表)
-- ============================================
CREATE TABLE IF NOT EXISTS booking_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES events_ticket_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_ticket DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_booking_tickets_booking_id ON booking_tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_tickets_ticket_type_id ON booking_tickets(ticket_type_id);

-- ============================================
-- 4. Helper Functions (輔助函數)
-- ============================================

-- 付款成功後減少票券數量
CREATE OR REPLACE FUNCTION decrement_ticket_quantity(
  ticket_type_id UUID,
  decrement_by INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE events_ticket_types
  SET 
    available_tickets = available_tickets - decrement_by,
    booked_tickets = booked_tickets + decrement_by
  WHERE id = ticket_type_id;
END;
$$ LANGUAGE plpgsql;

-- 取消訂單後增加票券數量
CREATE OR REPLACE FUNCTION increment_ticket_quantity(
  ticket_type_id UUID,
  increment_by INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE events_ticket_types
  SET 
    available_tickets = available_tickets + increment_by,
    booked_tickets = booked_tickets - increment_by
  WHERE id = ticket_type_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Row Level Security (RLS) 政策 - Bookings
-- ============================================

-- 啟用 RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_tickets ENABLE ROW LEVEL SECURITY;

-- Bookings 政策：用戶只能查看和管理自己的訂單
-- Drop existing policies if present to allow idempotent runs
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Booking Tickets 政策：用戶只能查看自己訂單的票券
-- Drop existing booking_tickets policies if present
DROP POLICY IF EXISTS "Users can view their booking tickets" ON booking_tickets;
DROP POLICY IF EXISTS "Users can create booking tickets" ON booking_tickets;

CREATE POLICY "Users can view their booking tickets"
  ON booking_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_tickets.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create booking tickets"
  ON booking_tickets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_tickets.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- ============================================
-- 6. 驗證安裝
-- ============================================

-- 查看新建的表格
SELECT 
  schemaname, 
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('events_ticket_types', 'bookings', 'booking_tickets')
ORDER BY tablename;

-- 查看所有表格（應該包含 events, event_ticket_types, bookings, booking_tickets）
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;
