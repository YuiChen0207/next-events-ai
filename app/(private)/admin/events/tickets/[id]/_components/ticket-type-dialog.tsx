"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createTicketType,
  updateTicketTypeById,
} from "@/actions/event-ticket-types";
import toast from "react-hot-toast";
import { IEventTicketType } from "@/interfaces";
import { useRouter } from "next/navigation";

// Zod schema for type-safe validation
const ticketTypeSchema = z.object({
  name: z.string().min(1, "Ticket name is required").trim(),
  price: z.number().min(0, "Price must be at least 0"),
  total_tickets: z
    .number()
    .int("Must be an integer")
    .min(1, "At least 1 ticket is required"),
});

type TicketTypeFormValues = z.infer<typeof ticketTypeSchema>;

interface TicketTypeDialogProps {
  eventId: string;
  ticketType?: IEventTicketType;
  mode?: "create" | "edit";
}

export function TicketTypeDialog({
  eventId,
  ticketType,
  mode = "create",
}: TicketTypeDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<TicketTypeFormValues>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: "",
      price: 0,
      total_tickets: 1,
    },
  });

  // Sync ticketType data when dialog opens
  useEffect(() => {
    if (open && ticketType && mode === "edit") {
      form.reset({
        name: ticketType.name,
        price: ticketType.price,
        total_tickets: ticketType.total_tickets,
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        price: 0,
        total_tickets: 1,
      });
    }
  }, [open, ticketType, mode, form]);

  const onSubmit = async (values: TicketTypeFormValues) => {
    try {
      // Determine action based on mode
      let action;

      if (mode === "create") {
        action = createTicketType({
          event_id: eventId,
          ...values,
        });
      } else if (mode === "edit" && ticketType?.id) {
        action = updateTicketTypeById(ticketType.id, values);
      } else {
        throw new Error("Cannot update ticket type: missing ticket type data");
      }

      const result = await action;

      // Unified success/error handling
      if (result.success) {
        setOpen(false);
        form.reset();
        router.refresh(); // 讓 Server Component re-fetch
        toast.success(
          result.message ||
            `Ticket type ${mode === "create" ? "created" : "updated"} successfully!`,
        );
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting ticket type:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="cursor-pointer">Add Ticket Type</Button>
        ) : (
          <Button variant="outline" size="sm" className="cursor-pointer">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add Ticket Type" : "Edit Ticket Type"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Create a new ticket type for this event."
                  : "Update the ticket type details."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., VIP, General Admission"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value), //input.value 永遠是 string
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_tickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Tickets</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 1 : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting
                  ? "Saving..."
                  : mode === "create"
                    ? "Create"
                    : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
