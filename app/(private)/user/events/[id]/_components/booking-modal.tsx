"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IEvent, IEventTicketType } from "@/interfaces";
import { createCheckoutSession } from "@/actions/payment";
import { BookingStepper } from "./booking-stepper";
import { BookingStepSelect } from "./booking-step-select";
import { BookingStepInfo } from "./booking-step-info";
import { BookingStepConfirm } from "./booking-step-confirm";

interface BookingModalProps {
  event: IEvent;
  ticketTypes: IEventTicketType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BookingStep = "select" | "info" | "confirm";

interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
  price: number;
  name: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
}

export function BookingModal({
  event,
  ticketTypes,
  open,
  onOpenChange,
}: BookingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<BookingStep>("select");
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);

  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0,
  );
  const totalTickets = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  const handleQuantityChange = (ticketType: IEventTicketType, qty: number) => {
    const quantity = Math.max(0, Math.min(qty, ticketType.available_tickets));

    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.ticketTypeId === ticketType.id);

      if (quantity === 0) {
        return prev.filter((t) => t.ticketTypeId !== ticketType.id);
      }

      if (existing) {
        return prev.map((t) =>
          t.ticketTypeId === ticketType.id ? { ...t, quantity } : t,
        );
      }

      return [
        ...prev,
        {
          ticketTypeId: ticketType.id,
          quantity,
          price: ticketType.price,
          name: ticketType.name,
        },
      ];
    });
  };

  const getQuantity = (ticketTypeId: string) => {
    return (
      selectedTickets.find((t) => t.ticketTypeId === ticketTypeId)?.quantity ||
      0
    );
  };

  const handleNext = () => {
    if (step === "select" && totalTickets > 0) {
      setStep("info");
    } else if (step === "info" && isFormValid()) {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "info") {
      setStep("select");
    } else if (step === "confirm") {
      setStep("info");
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phone.trim().length > 0
    );
  };

  const handleFormChange = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await createCheckoutSession({
          eventId: event.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          tickets: selectedTickets.map((t) => ({
            ticketTypeId: t.ticketTypeId,
            quantity: t.quantity,
          })),
        });

        if (!result.success || !result.sessionUrl) {
          setError(
            result.message ||
              "Failed to create checkout session. Please try again.",
          );
          return;
        }

        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl;
      } catch (error) {
        console.error("Checkout error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      setStep("select");
      setSelectedTickets([]);
      setFormData({ name: "", email: "", phone: "" });
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Tickets</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{event.title}</p>
        </DialogHeader>

        <BookingStepper currentStep={step} />

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
          </div>
        )}

        {step === "select" && (
          <BookingStepSelect
            ticketTypes={ticketTypes}
            selectedTickets={selectedTickets}
            onQuantityChange={handleQuantityChange}
            getQuantity={getQuantity}
            onCancel={() => handleOpenChange(false)}
            onContinue={handleNext}
          />
        )}

        {step === "info" && (
          <BookingStepInfo
            formData={formData}
            selectedTickets={selectedTickets}
            onFormChange={handleFormChange}
            onBack={handleBack}
            onContinue={handleNext}
            isFormValid={isFormValid()}
          />
        )}

        {step === "confirm" && (
          <BookingStepConfirm
            event={event}
            formData={formData}
            selectedTickets={selectedTickets}
            totalAmount={totalAmount}
            isPending={isPending}
            onBack={handleBack}
            onConfirm={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
