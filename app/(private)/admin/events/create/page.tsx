import { PageTitle } from "@/components/ui/page-title";
import EventForm from "./_components/event-form";

/**
 * Page component that renders the Create Event screen.
 *
 * Renders a centered container with a page title and an event form configured for creation.
 *
 * @returns A React element containing the create-event page layout
 */
export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <PageTitle>Create Event</PageTitle>
      <EventForm formType="create" />
    </div>
  );
}