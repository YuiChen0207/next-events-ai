"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { IBooking, IBookingTicket, ICreateBookingPayload } from "@/interfaces";

export interface IAdminBookingWithDetails {
  id: string;
  created_at: string;
  event_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled";
  stripe_session_id?: string;
  payment_intent_id?: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  event: {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location?: string;
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

export const getAllBookingsForAdmin = async (): Promise<{
  success: boolean;
  data?: IAdminBookingWithDetails[];
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

    // Verify admin role
    const { data: userProfile } = await supabase
      .from("user-profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!userProfile || userProfile.role !== "admin") {
      return {
        success: false,
        message: "Admin access required",
      };
    }

    // Call RPC function to get pre-formatted data
    const { data, error } = await supabase.rpc(
      "get_all_bookings_for_admin_with_details",
    );

    if (error) {
      console.error("Error fetching admin bookings:", error);
      return {
        success: false,
        message: "Failed to fetch bookings",
      };
    }

    // Data is already formatted by the database function
    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error in getAllBookingsForAdmin:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

export const createBooking = async (
  payload: ICreateBookingPayload,
): Promise<{
  success: boolean;
  data?: { booking: IBooking; tickets: IBookingTicket[] };
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "You must be logged in to book tickets.",
      };
    }

    // Validate tickets array
    if (!payload.tickets || payload.tickets.length === 0) {
      return {
        success: false,
        message: "Please select at least one ticket.",
      };
    }

    // Fetch ticket types to validate and calculate total
    const ticketTypeIds = payload.tickets.map((t) => t.ticket_type_id);
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from("events_ticket_types")
      .select("*")
      .in("id", ticketTypeIds);

    if (ticketTypesError || !ticketTypes) {
      console.error("Error fetching ticket types:", ticketTypesError);
      return {
        success: false,
        message: "Failed to fetch ticket information.",
      };
    }

    // Validate availability and calculate total
    let totalAmount = 0;
    const ticketMap = new Map(ticketTypes.map((tt) => [tt.id, tt]));

    for (const ticket of payload.tickets) {
      const ticketType = ticketMap.get(ticket.ticket_type_id);

      if (!ticketType) {
        return {
          success: false,
          message: `Ticket type not found.`,
        };
      }

      if (ticket.quantity > ticketType.available_tickets) {
        return {
          success: false,
          message: `Only ${ticketType.available_tickets} tickets available for ${ticketType.name}.`,
        };
      }

      if (ticket.quantity <= 0) {
        return {
          success: false,
          message: "Ticket quantity must be greater than 0.",
        };
      }

      totalAmount += ticketType.price * ticket.quantity;
    }

    // Start transaction: Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        event_id: payload.event_id,
        user_id: user.id,
        customer_name: payload.customer_name,
        customer_email: payload.customer_email,
        customer_phone: payload.customer_phone,
        total_amount: totalAmount,
        status: "confirmed",
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Error creating booking:", bookingError);
      return {
        success: false,
        message: bookingError?.message || "Failed to create booking.",
      };
    }

    // Create booking tickets and update ticket types
    const bookingTicketsData: IBookingTicket[] = [];

    for (const ticket of payload.tickets) {
      const ticketType = ticketMap.get(ticket.ticket_type_id)!;

      // Insert booking ticket
      const { data: bookingTicket, error: ticketError } = await supabase
        .from("booking_tickets")
        .insert({
          booking_id: booking.id,
          ticket_type_id: ticket.ticket_type_id,
          quantity: ticket.quantity,
          price_per_ticket: ticketType.price,
          subtotal: ticketType.price * ticket.quantity,
        })
        .select()
        .single();

      if (ticketError || !bookingTicket) {
        console.error("Error creating booking ticket:", ticketError);
        // Rollback: delete booking (simplified, should use DB transactions)
        await supabase.from("bookings").delete().eq("id", booking.id);
        return {
          success: false,
          message: "Failed to create booking tickets.",
        };
      }

      bookingTicketsData.push(bookingTicket);

      // Update ticket type availability
      const { error: updateError } = await supabase
        .from("events_ticket_types")
        .update({
          available_tickets: ticketType.available_tickets - ticket.quantity,
          booked_tickets: ticketType.booked_tickets + ticket.quantity,
        })
        .eq("id", ticket.ticket_type_id);

      if (updateError) {
        console.error("Error updating ticket availability:", updateError);
        // Continue anyway, but log the error
      }
    }

    // Revalidate relevant paths
    revalidatePath(`/user/events/${payload.event_id}`);
    revalidatePath("/user/bookings");
    revalidatePath("/admin/bookings");

    return {
      success: true,
      data: {
        booking,
        tickets: bookingTicketsData,
      },
      message: "Booking created successfully!",
    };
  } catch (error) {
    console.error("Unexpected error in createBooking:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

export const getUserBookings = async (): Promise<{
  success: boolean;
  data?: IBooking[];
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
        message: "You must be logged in to view bookings.",
      };
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch bookings.",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Unexpected error in getUserBookings:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const getBookingById = async (
  bookingId: string,
): Promise<{
  success: boolean;
  data?: {
    booking: IBooking;
    tickets: IBookingTicket[];
  };
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
        message: "You must be logged in.",
      };
    }

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Error fetching booking:", bookingError);
      return {
        success: false,
        message: "Booking not found.",
      };
    }

    // Check authorization
    if (booking.user_id !== user.id) {
      return {
        success: false,
        message: "You are not authorized to view this booking.",
      };
    }

    // Fetch booking tickets
    const { data: tickets, error: ticketsError } = await supabase
      .from("booking_tickets")
      .select("*")
      .eq("booking_id", bookingId);

    if (ticketsError) {
      console.error("Error fetching booking tickets:", ticketsError);
      return {
        success: false,
        message: "Failed to fetch booking details.",
      };
    }

    return {
      success: true,
      data: {
        booking,
        tickets: tickets || [],
      },
    };
  } catch (error) {
    console.error("Unexpected error in getBookingById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};
