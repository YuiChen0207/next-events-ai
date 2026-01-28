interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
  price: number;
  name: string;
}

interface OrderSummaryProps {
  selectedTickets: TicketSelection[];
  showDetails?: boolean;
}

export function OrderSummary({
  selectedTickets,
  showDetails = true,
}: OrderSummaryProps) {
  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0,
  );
  const totalTickets = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
      {showDetails && (
        <>
          <h4 className="font-semibold mb-2">Order Summary</h4>
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
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
      {!showDetails && (
        <>
          <div className="flex justify-between text-sm">
            <span>Total Tickets:</span>
            <span className="font-medium">{totalTickets}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
}
