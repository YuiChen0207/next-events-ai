import { PageTitle } from "@/components/ui/page-title";
import EventForm from "../../create/_components/event-form";

/**
 * Page component that renders an "Edit Event" title and an event form configured for editing.
 *
 * @returns A JSX element containing a container with the page title and an EventForm set to edit mode.
 */
export default function EditEventPage() {
  return (
    <div className="container mx-auto p-8">
      <PageTitle>Edit Event</PageTitle>
      <EventForm formType="edit" />
    </div>
  );
}