import { PageTitle } from "@/components/ui/page-title";
import EventForm from "./_components/event-form";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto p-8">
      <PageTitle>Create Event</PageTitle>
      <EventForm formType="create" />
    </div>
  );
}
