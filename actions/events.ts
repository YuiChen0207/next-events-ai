"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { IEvent, ICreateEventPayload } from "@/interfaces";
import { uploadFilesAndGetUrls } from "./file-uploads";

export const createEvent = async (
  payload: ICreateEventPayload,
  files?: File[],
): Promise<{
  success: boolean;
  data?: IEvent;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let imageUrls: string[] = [];

    // Upload files if provided
    if (files && files.length > 0) {
      const uploadResult = await uploadFilesAndGetUrls(files);

      if (!uploadResult.success) {
        throw new Error(uploadResult.message || "Failed to upload files");
      }

      imageUrls = uploadResult.urls || [];
    }

    // Add image URLs to payload
    const eventData = {
      ...payload,
      images: imageUrls,
    };

    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return {
        success: false,
        message: error.message || "Failed to create event.",
      };
    }

    return {
      success: true,
      data: data as IEvent,
      message: "Event created successfully.",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in createEvent:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};

export const updateEventById = async (
  id: string,
  payload: Partial<IEvent>,
): Promise<{
  success: boolean;
  data?: IEvent;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return {
        success: false,
        message: error.message || "Failed to update event.",
      };
    }

    return {
      success: true,
      data: data as IEvent,
      message: "Event updated successfully.",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in updateEventById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const deleteEventById = async (
  id: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
      return {
        success: false,
        message: error.message || "Failed to delete event.",
      };
    }

    return {
      success: true,
      message: "Event deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in deleteEventById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const getEventById = async (
  id: string,
): Promise<{
  success: boolean;
  data?: IEvent;
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch event.",
      };
    }

    return {
      success: true,
      data: data as IEvent,
    };
  } catch (error: unknown) {
    console.error("Unexpected error in getEventById:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const getAllEvents = async (): Promise<{
  success: boolean;
  data?: IEvent[];
  message?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch events.",
      };
    }

    return {
      success: true,
      data: data as IEvent[],
    };
  } catch (error: unknown) {
    console.error("Unexpected error in getAllEvents:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};
