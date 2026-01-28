"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IEvent, IEventTicketType } from "@/interfaces";
import { BookingModal } from "./booking-modal";
import { EventInfoCard } from "./event-info-card";
import { TicketCard } from "./ticket-card";
import { EventGallery } from "./event-gallery";
import { HelpInfoCard } from "./help-info-card";
import { TicketIcon } from "./icons";

interface EventDetailClientProps {
  event: IEvent;
  ticketTypes: IEventTicketType[];
}

export function EventDetailClient({
  event,
  ticketTypes,
}: EventDetailClientProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const hasAvailableTickets = ticketTypes.some(
    (ticket) => ticket.available_tickets > 0,
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Images */}
          {event.images && event.images.length > 0 && (
            <div className="relative h-[500px] rounded-lg overflow-hidden bg-muted shadow-sm border border-border/60">
              <Image
                src={event.images[0]}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                quality={100}
                priority
              />
            </div>
          )}

          {/* Event Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {event.title}
              </h1>
              <span className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium tracking-wide bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                {event.status}
              </span>
            </div>
            {event.small_description && (
              <p className="text-xl text-muted-foreground">
                {event.small_description}
              </p>
            )}
          </div>

          {/* Event Details Grid */}
          <EventInfoCard event={event} />

          {/* Full Description */}
          {event.full_description && (
            <div className="bg-card border border-border/60 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">About This Event</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.full_description}
              </div>
            </div>
          )}

          {/* Additional Images */}
          <EventGallery images={event.images || []} eventTitle={event.title} />
        </div>

        {/* Sidebar - Ticket Types */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/60 p-6">
                <h2 className="text-xl font-semibold">Ticket Options</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your ticket type
                </p>
              </div>

              <div className="p-6">
                {ticketTypes.length === 0 ? (
                  <div className="text-center py-8">
                    <TicketIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No tickets available yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ticketTypes.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}

                    {/* Book Now Button */}
                    <Button
                      className="w-full cursor-pointer"
                      size="lg"
                      onClick={() => setIsBookingModalOpen(true)}
                      disabled={!hasAvailableTickets}
                    >
                      {hasAvailableTickets
                        ? "Book Now"
                        : "All Tickets Sold Out"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Event Info Summary */}
            <HelpInfoCard />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        event={event}
        ticketTypes={ticketTypes}
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
      />
    </>
  );
}
