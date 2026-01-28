"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export interface IUserBookingWithDetails {
  id: string;
  created_at: string;
  event_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled";
  stripe_session_id?: string;
  payment_intent_id?: string;
  event: {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location?: string;
    images?: string[];
  };
  tickets: Array<{
    id: string;
    quantity: number;
    price_per_ticket: number;
    subtotal: number;
    ticket_type: {
      name: string;
    };
  }>;
}

export const getUserConfirmedBookings = async (): Promise<{
  success: boolean;
  data?: IUserBookingWithDetails[];
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Call database function that returns pre-formatted data
    // This eliminates all data transformation in the application layer
    const { data: bookings, error } = await supabase.rpc(
      "get_user_confirmed_bookings_with_details",
      { p_user_id: user.id },
    );

    if (error) {
      console.error("Error fetching user bookings:", error);
      return {
        success: false,
        message: "Failed to fetch bookings",
      };
    }

    if (!bookings || bookings.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // Data is already formatted by the database function
    // Only need to ensure proper typing
    return {
      success: true,
      data: bookings as IUserBookingWithDetails[],
    };
  } catch (error) {
    console.error("Error in getUserConfirmedBookings:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
