import { IEventTicketType } from "@/interfaces";

interface TicketCardProps {
  ticket: IEventTicketType;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className="border border-border/60 rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{ticket.name}</h3>
          <p className="text-2xl font-bold text-primary mt-1">
            ${ticket.price.toFixed(2)}
          </p>
        </div>
        {ticket.available_tickets > 0 ? (
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Available
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Sold Out
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Available:</span>
          <span className="font-medium">
            {ticket.available_tickets} / {ticket.total_tickets}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Booked:</span>
          <span className="font-medium">{ticket.booked_tickets}</span>
        </div>
      </div>
    </div>
  );
}
