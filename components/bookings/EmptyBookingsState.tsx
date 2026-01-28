export function EmptyBookingsState() {
  return (
    <div className="bg-card border border-border/60 rounded-sm shadow-sm p-12 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
        <p className="text-muted-foreground">
          Bookings will appear here once users start making reservations for
          events.
        </p>
      </div>
    </div>
  );
}
