/**
 * Render the My Bookings page.
 *
 * Displays a heading and a card containing placeholder text indicating where event bookings will appear.
 *
 * @returns The JSX element for the My Bookings page (heading and placeholder card).
 */
export default function UserBookingsPage() {
  return (
    
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground">
          Your event bookings will appear here.
        </p>
      </div>
    </div>
  );
}