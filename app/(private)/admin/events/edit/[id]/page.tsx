import EventForm from "../../create/_components/event-form";
import { getEventById } from "@/actions/events";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound(); // 會直接 render 404 page
  }

  const event = result.data;

  // Transform event data to match form fields
  const initialData = {
    title: event.title,
    shortDescription: event.small_description || "",
    fullDescription: event.full_description || "",
    location: event.location || "",
    date: event.date,
    startTime: event.start_time,
    endTime: event.end_time,
    capacity: event.capacity.toString(),
    status: event.status,
  };

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/admin/events" label="Back to Events" />
      </div>
      <EventForm
        formType="edit"
        eventId={id}
        initialData={initialData}
        initialImages={event.images || []}
      />
    </div>
  );
}
