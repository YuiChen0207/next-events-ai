import { Button } from "@/components/ui/button";
import { IEvent } from "@/interfaces";

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

interface BookingStepConfirmProps {
  event: IEvent;
  formData: BookingFormData;
  selectedTickets: TicketSelection[];
  totalAmount: number;
  isPending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingStepConfirm({
  event,
  formData,
  selectedTickets,
  totalAmount,
  isPending,
  onBack,
  onConfirm,
}: BookingStepConfirmProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Event Details</h4>
          <p className="text-sm">{event.title}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {event.start_time.slice(0, 5)}
          </p>
          {event.location && (
            <p className="text-sm text-muted-foreground">{event.location}</p>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="font-semibold mb-2">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span>{" "}
              {formData.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {formData.email}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              {formData.phone}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="font-semibold mb-2">Tickets</h4>
          <div className="space-y-2">
            {selectedTickets.map((ticket) => (
              <div
                key={ticket.ticketTypeId}
                className="flex justify-between text-sm"
              >
                <span>
                  {ticket.name} × {ticket.quantity}
                </span>
                <span className="font-medium">
                  ${(ticket.price * ticket.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💳 You will be redirected to Stripe for secure payment processing.
          Your booking will be confirmed after successful payment.
        </p>
      </div>

      <div className="flex justify-between gap-2 pt-4">
        <Button
          type="button"
          className="cursor-pointer"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="min-w-32 cursor-pointer"
        >
          {isPending ? "Processing..." : "Confirm & Pay"}
        </Button>
      </div>
    </div>
  );
}
