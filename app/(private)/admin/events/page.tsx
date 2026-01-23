import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";

/**
 * Render the admin events management page with a title and a "Create Event" action.
 *
 * @returns The JSX element for the admin events management page, containing a PageTitle, a Button wrapped by a client-side Link to `/admin/events/create`, and a placeholder card for event content.
 */
export default function AdminEventsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Manage Events</PageTitle>
        <Link href="/admin/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground">
          Event management interface will appear here.
        </p>
      </div>
    </div>
  );
}