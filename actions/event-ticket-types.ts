"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { IEventTicketType, ICreateTicketTypePayload } from "@/interfaces";

export const createTicketType = async (
  payload: ICreateTicketTypePayload,
): Promise<{
  success: boolean;
  data?: IEventTicketType;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Validate total_tickets
    if (
      typeof payload.total_tickets !== "number" ||
      !Number.isInteger(payload.total_tickets) ||
      payload.total_tickets <= 0
    ) {
      return {
        success: false,
        message: "total_tickets must be a positive integer greater than 0.",
      };
    }

    // 初始化 available_tickets 和 booked_tickets
    const ticketData = {
      ...payload,
      available_tickets: payload.total_tickets,
      booked_tickets: 0,
    };

    const { data, error } = await supabase
      .from("events_ticket_types")
      .insert(ticketData)
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket type:", error);
      return {
        success: false,
        message: error.message || "Failed to create ticket type.",
      };
    }

    // Server Component 的資料預設會被快取，revalidatePath可以「失效 Server Cache」
    revalidatePath(`/admin/events/tickets/${payload.event_id}`);

    return {
      success: true,
      data: data as IEventTicketType,
      message: "Ticket type created successfully.",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in createTicketType:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const updateTicketTypeById = async (
  id: string,
  payload: Partial<IEventTicketType>,
): Promise<{
  success: boolean;
  data?: IEventTicketType;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events_ticket_types")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ticket type:", error);
      return {
        success: false,
        message: error.message || "Failed to update ticket type.",
      };
    }

    if (data?.event_id) {
      revalidatePath(`/admin/events/tickets/${data.event_id}`);
    }

    return {
      success: true,
      data: data as IEventTicketType,
      message: "Ticket type updated successfully.",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in updateTicketTypeById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const deleteTicketTypeById = async (
  id: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get event_id before deleting
    const { data: ticketType } = await supabase
      .from("events_ticket_types")
      .select("event_id")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("events_ticket_types")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting ticket type:", error);
      return {
        success: false,
        message: error.message || "Failed to delete ticket type.",
      };
    }

    if (ticketType?.event_id) {
      revalidatePath(`/admin/events/tickets/${ticketType.event_id}`);
    }

    return {
      success: true,
      message: "Ticket type deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in deleteTicketTypeById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const getTicketTypeById = async (
  id: string,
): Promise<{
  success: boolean;
  data?: IEventTicketType;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events_ticket_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching ticket type:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch ticket type.",
      };
    }

    return {
      success: true,
      data: data as IEventTicketType,
    };
  } catch (error: unknown) {
    console.error("Unexpected error in getTicketTypeById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const getTicketTypesByEventId = async (
  eventId: string,
): Promise<{
  success: boolean;
  data?: IEventTicketType[];
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events_ticket_types")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching ticket types:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch ticket types.",
      };
    }

    return {
      success: true,
      data: data as IEventTicketType[],
    };
  } catch (error: unknown) {
    console.error("Unexpected error in getTicketTypesByEventId:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

//目前不需要用到，但先留著
export const getAllTicketTypes = async (): Promise<{
  success: boolean;
  data?: IEventTicketType[];
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events_ticket_types")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all ticket types:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch ticket types.",
      };
    }

    return {
      success: true,
      data: data as IEventTicketType[],
    };
  } catch (error: unknown) {
    console.error("Unexpected error in getAllTicketTypes:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};
