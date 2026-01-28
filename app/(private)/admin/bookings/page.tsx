import { getAllBookingsForAdmin } from "@/actions/bookings";
import { PageTitle } from "@/components/ui/page-title";
import { StatsCard } from "@/components/bookings/StatsCard";
import { EmptyBookingsState } from "@/components/bookings/EmptyBookingsState";
import { BookingCard } from "@/components/bookings/BookingCard";

export default async function AdminBookingsPage() {
  const { data: bookings, success } = await getAllBookingsForAdmin();

  if (!success || !bookings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Failed to load bookings</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  // Calculate stats - hoisted for clarity
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.total_amount, 0),
  };

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <PageTitle>Manage Bookings</PageTitle>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatsCard label="Total" value={stats.total} />
        <StatsCard
          label="Confirmed"
          value={stats.confirmed}
          className="text-foreground"
        />
        <StatsCard
          label="Pending"
          value={stats.pending}
          className="text-foreground"
        />
        <StatsCard
          label="Cancelled"
          value={stats.cancelled}
          className="text-foreground"
        />
        <StatsCard
          label="Revenue"
          value={`$${stats.revenue.toFixed(0)}`}
          className="text-2xl"
        />
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <EmptyBookingsState />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
