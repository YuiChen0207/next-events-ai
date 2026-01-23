import { PageTitle } from "@/components/ui/page-title";
import { BackButton } from "@/components/ui/back-button";
import { getEventById } from "@/actions/events";
import { notFound } from "next/navigation";
import {
  getTicketTypesByEventId,
  deleteTicketTypeById,
} from "@/actions/event-ticket-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketTypeDialog } from "./_components/ticket-type-dialog";
import { DeleteButton } from "@/components/ui/delete-button";

interface EventTicketTypesProps {
  params: Promise<{ id: string }>;
}

async function EventTicketTypes({ params }: EventTicketTypesProps) {
  const { id } = await params;
  const result = await getEventById(id);
  const event = result.success ? result.data : null;

  if (!result.success || !event) {
    notFound();
  }

  const ticketTypesResult = await getTicketTypesByEventId(id);
  const ticketTypes = ticketTypesResult.success
    ? ticketTypesResult.data || []
    : [];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <BackButton href="/admin/events" label="Back to Events" />
      <div className="flex justify-between items-start mb-8">
        <PageTitle>{event.title}</PageTitle>
        <TicketTypeDialog eventId={id} />
      </div>
      <div className="bg-card rounded-sm border border-border/60 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/100">
            <TableRow>
              <TableHead>Ticket Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Tickets</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Booked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-16"
                >
                  No ticket types found. Create your first ticket type!
                </TableCell>
              </TableRow>
            ) : (
              ticketTypes.map((ticketType) => (
                <TableRow key={ticketType.id}>
                  <TableCell className="font-medium">
                    {ticketType.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    ${ticketType.price}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ticketType.total_tickets}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ticketType.available_tickets}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ticketType.booked_tickets}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <TicketTypeDialog
                        eventId={id}
                        ticketType={ticketType}
                        mode="edit"
                      />
                      <DeleteButton
                        id={ticketType.id}
                        itemName={ticketType.name}
                        itemType="Ticket type"
                        onDelete={deleteTicketTypeById}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default EventTicketTypes;
