import { getUserConfirmedBookings } from "@/actions/user-bookings";
import { format } from "date-fns";
import VerifyToastOnSuccess from "@/components/payment/VerifyToastOnSuccess";

export default async function UserBookingsPage() {
  const result = await getUserConfirmedBookings();
  const bookings = result.success ? result.data || [] : [];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground text-lg">
          Your confirmed event tickets
        </p>
      </div>

      <VerifyToastOnSuccess />

      {bookings.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-lg shadow-sm p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground">
              Your confirmed bookings will appear here once you complete a
              purchase.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-1 tracking-tight">
                      {booking.event.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {format(new Date(booking.event.date), "MMMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {booking.event.start_time.substring(0, 5)}
                      </span>
                      {booking.event.location && (
                        <span className="flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {booking.event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium tracking-wide bg-primary/10 text-primary border border-primary/20">
                      Confirmed
                    </span>
                  </div>
                </div>

                {/* Tickets */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    Tickets
                  </h3>
                  <div className="space-y-2">
                    {booking.tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-secondary/50 flex items-center justify-center text-sm font-medium text-foreground">
                            {ticket.quantity}×
                          </div>
                          <span className="text-sm font-medium">
                            {ticket.ticket_type.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          TWD {ticket.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Booking ID: {booking.id.substring(0, 8)}...
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      Total Amount
                    </div>
                    <div className="text-xl font-semibold text-primary">
                      TWD {booking.total_amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
