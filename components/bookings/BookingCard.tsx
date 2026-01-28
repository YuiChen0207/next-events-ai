interface Booking {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
  };
  tickets: Array<{
    quantity: number;
  }>;
}

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusColor =
    statusColors[booking.status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  const totalTickets = booking.tickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  return (
    <div className="bg-card border border-border/60 rounded-sm shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{booking.event.title}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">{booking.customer_name}</p>
              <p className="text-muted-foreground text-xs">
                {booking.customer_email}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Event Date</p>
              <p className="font-medium">
                {new Date(booking.event.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Booking Date</p>
              <p className="font-medium">
                {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">
                ${booking.total_amount.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Tickets</p>
              <p className="font-medium">{totalTickets}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
