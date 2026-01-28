import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllEvents, deleteEventById } from "@/actions/events";
import { DeleteButton } from "@/components/ui/delete-button";

export default async function AdminEventsPage() {
  const result = await getAllEvents();
  const events = result.success ? result.data || [] : [];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="flex justify-between items-start">
        <PageTitle>Manage Events</PageTitle>
        <Link href="/admin/events/create">
          <Button className="cursor-pointer">Create Event</Button>
        </Link>
      </div>
      <div className="bg-card rounded-sm border border-border/60 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0e7490]/20">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-16"
                >
                  No events found. Create your first event!
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id} className="border-b border-border/60">
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {event.date}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {event.location || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {event.capacity}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide bg-primary/5 text-primary border border-primary/20">
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/events/edit/${event.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/events/tickets/${event.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          Tickets
                        </Button>
                      </Link>
                      <DeleteButton
                        id={event.id}
                        itemName={event.title}
                        itemType="Event"
                        onDelete={deleteEventById}
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
