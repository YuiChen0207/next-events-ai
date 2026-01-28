export interface IUser {
  id: number; // bigint from database (auto-increment)
  user_id: string; // UUID from auth.users
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string; // Only for registration, not stored in user-profiles
}

export interface IEvent {
  id: string; // UUID
  created_at: string;
  title: string;
  small_description?: string;
  full_description?: string;
  date: string; // Date string (YYYY-MM-DD)
  start_time: string; // Time string (HH:mm:ss)
  end_time: string; // Time string (HH:mm:ss)
  location?: string;
  capacity: number;
  images?: string[];
  status: string;
  guests?: string;
}

export interface IEventTicketType {
  id: string; // UUID
  created_at: string;
  event_id: string; // UUID
  name: string;
  price: number;
  total_tickets: number;
  available_tickets: number;
  booked_tickets: number;
}

export interface ICreateCheckoutTicket {
  ticketTypeId: string;
  quantity: number;
}

export interface ICreateCheckoutPayload {
  eventId: string;
  tickets: ICreateCheckoutTicket[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface ICreateCheckoutResult {
  success: boolean;
  message: string;
  sessionUrl?: string;
  bookingId?: string;
}

export interface ICreateEventPayload {
  title: string;
  small_description?: string;
  full_description?: string;
  date: string; // Date string (YYYY-MM-DD)
  start_time: string; // Time string (HH:mm:ss)
  end_time: string; // Time string (HH:mm:ss)
  location?: string;
  capacity: number;
  images?: string[];
  status?: string;
  guests?: string;
}

export interface ICreateTicketTypePayload {
  event_id: string; // UUID
  name: string;
  price: number;
  total_tickets: number;
}

export interface IBooking {
  id: string; // UUID
  created_at: string;
  event_id: string; // UUID
  user_id: string; // UUID from auth.users
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled";
  stripe_session_id?: string;
  payment_intent_id?: string;
}

export interface IBookingTicket {
  id: string; // UUID
  created_at: string;
  booking_id: string; // UUID
  ticket_type_id: string; // UUID
  quantity: number;
  price_per_ticket: number;
  subtotal: number;
}

export interface ICreateBookingPayload {
  event_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tickets: {
    ticket_type_id: string;
    quantity: number;
  }[];
}
