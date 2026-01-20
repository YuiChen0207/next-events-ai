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
  status: "draft" | "published" | "cancelled" | "completed";
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
  status?: "draft" | "published" | "cancelled" | "completed";
  guests?: string;
}

export interface ICreateTicketTypePayload {
  event_id: string; // UUID
  name: string;
  price: number;
  total_tickets: number;
}
