import { IEvent } from "@/interfaces";
import { CalendarIcon, ClockIcon, LocationIcon, UsersIcon } from "./icons";

interface EventInfoCardProps {
  event: IEvent;
}

export function EventInfoCard({ event }: EventInfoCardProps) {
  return (
    <div className="bg-card border border-border/60 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Event Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-lg p-2.5 mt-0.5">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Date
            </div>
            <div className="font-semibold">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-lg p-2.5 mt-0.5">
            <ClockIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Time
            </div>
            <div className="font-semibold">
              {event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}
            </div>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-lg p-2.5 mt-0.5">
              <LocationIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Location
              </div>
              <div className="font-semibold">{event.location}</div>
            </div>
          </div>
        )}

        {/* Capacity */}
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-lg p-2.5 mt-0.5">
            <UsersIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Capacity
            </div>
            <div className="font-semibold">{event.capacity} attendees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
