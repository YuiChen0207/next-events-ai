import { getEventById } from "@/actions/events";
import { getTicketTypesByEventId } from "@/actions/event-ticket-types";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { EventDetailClient } from "./_components/event-detail-client";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;

  const ticketTypesResult = await getTicketTypesByEventId(id);
  const ticketTypes = ticketTypesResult.success
    ? ticketTypesResult.data || []
    : [];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <BackButton href="/user/events" label="Back to Events" />
      <EventDetailClient event={event} ticketTypes={ticketTypes} />
    </div>
  );
}
