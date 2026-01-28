import { Button } from "@/components/ui/button";
import { IEventTicketType } from "@/interfaces";
import { TicketSelector } from "./ticket-selector";
import { OrderSummary } from "./order-summary";

interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
  price: number;
  name: string;
}

interface BookingStepSelectProps {
  ticketTypes: IEventTicketType[];
  selectedTickets: TicketSelection[];
  onQuantityChange: (ticketType: IEventTicketType, qty: number) => void;
  getQuantity: (ticketTypeId: string) => number;
  onCancel: () => void;
  onContinue: () => void;
}

export function BookingStepSelect({
  ticketTypes,
  selectedTickets,
  onQuantityChange,
  getQuantity,
  onCancel,
  onContinue,
}: BookingStepSelectProps) {
  const totalTickets = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {ticketTypes.map((ticketType) => (
          <TicketSelector
            key={ticketType.id}
            ticketType={ticketType}
            quantity={getQuantity(ticketType.id)}
            onQuantityChange={(qty) => onQuantityChange(ticketType, qty)}
          />
        ))}
      </div>

      {totalTickets > 0 && (
        <OrderSummary selectedTickets={selectedTickets} showDetails={false} />
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          className="cursor-pointer"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="cursor-pointer"
          onClick={onContinue}
          disabled={totalTickets === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
