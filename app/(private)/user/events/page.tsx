import { getAllEvents } from "@/actions/events";
import Link from "next/link";
import Image from "next/image";

async function UserEventsPage() {
  const result = await getAllEvents();
  const events = result.success ? result.data || [] : [];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Discover Events
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse and book tickets for upcoming events
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-lg shadow-sm p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
            <p className="text-muted-foreground">
              There are no events at the moment. Check back soon for exciting
              upcoming events!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/user/events/${event.id}`}
              className="group"
            >
              <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:border-border transition-all duration-200 h-full flex flex-col">
                {/* Event Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {event.images && event.images.length > 0 ? (
                    <Image
                      src={event.images[0]}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      quality={100}
                      priority
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-muted-foreground/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium tracking-wide bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  {event.small_description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {event.small_description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm pt-3 border-t border-border/40">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-muted-foreground/70">•</span>
                      <span>{event.start_time.slice(0, 5)}</span>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}

                    {/* Capacity */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>{event.capacity} attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserEventsPage;
