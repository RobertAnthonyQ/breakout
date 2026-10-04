"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LumaEvent } from "@/app/api/luma-events/route";

gsap.registerPlugin(ScrollTrigger);

const LUMA_CALENDAR_URL = "https://luma.com/breakoutlatam";

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  hour: "numeric",
  minute: "2-digit",
});

function formatEventWhen(startAt: string): string {
  const date = new Date(startAt);
  const day = dateFormatter.format(date);
  const time = timeFormatter.format(date);
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`;
}

interface EventsData {
  upcoming: LumaEvent[];
  past: LumaEvent[];
}

function EventCard({ event, isPast }: { event: LumaEvent; isPast?: boolean }) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noreferrer"
      className={`group rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 ${
        isPast ? "opacity-70 hover:opacity-100" : ""
      }`}
      style={{ border: "1px solid var(--bo-line)" }}
    >
      <div className="relative w-full aspect-[4/3] bg-[var(--bo-paper)]">
        {event.coverUrl && (
          <Image
            src={event.coverUrl}
            alt={event.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--bo-cobalt)] mb-2">
          {formatEventWhen(event.startAt)}
        </p>
        <p className="font-display text-2xl text-[var(--bo-ink)] leading-tight group-hover:text-[var(--bo-cobalt)] transition-colors">
          {event.name}
        </p>
        {event.hosts.length > 0 && (
          <p className="text-sm text-[var(--bo-muted)] mt-2">
            {event.hosts.join(" · ")}
          </p>
        )}
      </div>
    </a>
  );
}

export default function Events() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [data, setData] = useState<EventsData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/luma-events")
      .then((res) => res.json())
      .then((json: EventsData) => {
        if (!cancelled) setData({ upcoming: json.upcoming ?? [], past: json.past ?? [] });
      })
      .catch(() => {
        if (!cancelled) setData({ upcoming: [], past: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // El body pasa al registro blanco mientras se ve la sección de Eventos.
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 65%",
      end: "bottom top",
      toggleClass: { targets: document.body, className: "events-light" },
    });

    // La sección crece una vez que llegan los eventos de Luma (el esqueleto de carga
    // es mucho más corto), así que hay que recalcular dónde termina el blanco.
    ScrollTrigger.refresh();

    return () => trigger.kill();
  }, [data]);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative w-full py-20 md:py-32"
      aria-label="Eventos de Breakout"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <h2 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-center mb-6 leading-[0.9] text-[var(--bo-ink)]">
          <span className="text-outline inline-block">Nuestros</span>{" "}
          <span className="text-[var(--bo-cobalt)] inline-block">Eventos</span>
        </h2>

        <p className="text-center max-w-2xl mx-auto mb-12 text-base sm:text-lg text-[var(--bo-muted)]">
          Todos nuestros eventos, propios y co-organizados, en vivo desde Luma.{" "}
          <a
            href={LUMA_CALENDAR_URL}
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold text-[var(--bo-cobalt)]"
          >
            Síguenos en Luma
          </a>
        </p>

        {data === null ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl aspect-[4/5] animate-pulse"
                style={{ background: "var(--bo-line)" }}
              />
            ))}
          </div>
        ) : (
          <>
            {data.upcoming.length === 0 ? (
              <div
                className="max-w-xl mx-auto text-center rounded-2xl p-12 mb-16"
                style={{ border: "1px solid var(--bo-line)" }}
              >
                <p className="text-lg font-semibold text-[var(--bo-ink)]">
                  No hay próximos eventos
                </p>
                <p className="text-[var(--bo-muted)] mt-2">
                  Vuelve más tarde para ver nuevos eventos.
                </p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {data.upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {data.past.length > 0 && (
              <div className="max-w-5xl mx-auto">
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--bo-ink)] mb-6">
                  Eventos anteriores
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.past.map((event) => (
                    <EventCard key={event.id} event={event} isPast />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
