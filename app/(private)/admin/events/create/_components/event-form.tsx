"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { createEvent } from "@/actions/events";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Event title is required.",
  }),
  shortDescription: z.string().min(1, {
    message: "Short description is required.",
  }),
  fullDescription: z.string().min(1, {
    message: "Full description is required.",
  }),
  location: z.string().min(1, {
    message: "Location is required.",
  }),
  date: z.string().min(1, {
    message: "Event date is required.",
  }),
  startTime: z.string().min(1, {
    message: "Start time is required.",
  }),
  endTime: z.string().min(1, {
    message: "End time is required.",
  }),
  capacity: z.string().min(1, {
    message: "Capacity is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
});

interface EventFormProps {
  formType: "create" | "edit";
}

/**
 * Render an event creation/edit form with validation, image upload previews, and submission handling.
 *
 * The form uses zod validation and react-hook-form, supports multiple image selection with object-URL previews
 * (revoking URLs on removal and component unmount), and submits a payload to createEvent.
 *
 * @param formType - "create" to render creation UI or "edit" to render editing UI; affects the submit button label.
 * @returns A React element containing the event form UI.
 */
function EventForm({ formType }: EventFormProps) {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      capacity: "",
      status: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Prepare payload matching ICreateEventPayload interface
      const payload = {
        title: values.title,
        small_description: values.shortDescription,
        full_description: values.fullDescription,
        date: values.date,
        start_time: values.startTime,
        end_time: values.endTime,
        location: values.location,
        capacity: parseInt(values.capacity),
        status: values.status,
      };

      // Call createEvent with payload and files
      const result = await createEvent(payload, selectedImages);

      if (!result.success) {
        throw new Error(result.message || "Failed to create event");
      }

      toast.success("Event created successfully!");
      router.push("/admin/events");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Revoke existing blob URLs to prevent memory leaks
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      const filesArray = Array.from(files); // 轉成array所以可以操作
      setSelectedImages(filesArray);

      // Create preview URLs
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      previewUrlsRef.current = previews;
    }
  };

  const removeImage = (index: number) => {
    // Revoke the blob URL for the image being removed
    URL.revokeObjectURL(imagePreviews[index]);

    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    previewUrlsRef.current = newPreviews;
  };

  // Cleanup effect to revoke all blob URLs on component unmount
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="bg-card border rounded-lg shadow-lg p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter event title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter short description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter full description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter event location"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="cursor-pointer"
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="cursor-pointer"
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter capacity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Event Images</FormLabel>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative aspect-square overflow-hidden rounded-lg border bg-muted group"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute inset-0 bg-black/0" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 cursor-pointer"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            size="lg"
            disabled={isLoading}
          >
            {isLoading
              ? formType === "create"
                ? "Creating..."
                : "Updating..."
              : formType === "create"
                ? "Create Event"
                : "Update Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EventForm;