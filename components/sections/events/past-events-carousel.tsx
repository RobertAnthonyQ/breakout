import React from "react";
import Image from "next/image";
import type { Event } from "./events.data";

interface PastEventsCarouselProps {
  events: Event[];
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}

export default function PastEventsCarousel({
  events,
  titleRef,
  listRef,
}: PastEventsCarouselProps) {
  return (
    <div className="mt-2">
      <h4
        ref={titleRef}
        className="text-lg font-black uppercase tracking-wider mb-4"
        style={{
          color: "#1a1a1a",
          letterSpacing: "0.1em",
        }}
      >
        Eventos Anteriores
      </h4>
      <div
        ref={listRef}
        className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="flex-shrink-0 snap-start group cursor-pointer relative"
            style={{ width: "140px" }}
          >
            <div
              className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
              style={{
                borderRadius: "16px",
                border: "2px solid rgba(33, 79, 221, 0.2)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image
                src={event.image}
                alt={event.title}
                width={400}
                height={128}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <p className="text-white text-xs font-bold text-center px-2">
                  {event.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
