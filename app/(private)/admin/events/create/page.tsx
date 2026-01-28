import { PageTitle } from "@/components/ui/page-title";
import EventForm from "./_components/event-form";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <PageTitle>Create Event</PageTitle>
      <EventForm formType="create" />
    </div>
  );
}
