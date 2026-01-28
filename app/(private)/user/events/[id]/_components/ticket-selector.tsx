import { Button } from "@/components/ui/button";
import { IEventTicketType } from "@/interfaces";

interface TicketSelectorProps {
  ticketType: IEventTicketType;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function TicketSelector({
  ticketType,
  quantity,
  onQuantityChange,
}: TicketSelectorProps) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{ticketType.name}</h4>
          <p className="text-2xl font-bold mt-1">
            ${ticketType.price.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {ticketType.available_tickets} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity === 0}
          >
            −
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            type="button"
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={quantity >= ticketType.available_tickets}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
