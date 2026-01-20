import { PageTitle } from "@/components/ui/page-title";
import EventForm from "../../create/_components/event-form";

export default function EditEventPage() {
  return (
    <div className="container mx-auto p-8">
      <PageTitle>Edit Event</PageTitle>
      <EventForm formType="edit" />
    </div>
  );
}
