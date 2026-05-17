"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { mainEvent, pastEvents } from "./events.data";
import MainEventCard from "./main-event-card";
import EventDetails from "./event-details";
import PastEventsCarousel from "./past-events-carousel";

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const pastListRef = useRef<HTMLDivElement | null>(null);
  const pastTitleRef = useRef<HTMLHeadingElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Hover functionality can be added here in the future if needed

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const hero = heroRef.current;
    const rightCol = rightColRef.current;
    const pastList = pastListRef.current;
    const pastTitle = pastTitleRef.current;

    if (!section || !title || !hero) return;

    if (shouldReduceMotion) {
      gsap.set([title, hero, rightCol, pastList, pastTitle], { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Aplicar clase global al body mientras la sección esté visible
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom", // cuando el top de la sección toca la parte baja de la ventana
        end: "bottom top", // hasta que el bottom pase por el top
        toggleClass: { targets: document.body, className: "events-light" },
      });

      // Animación del título con split text effect
      const titleChars = title.textContent?.split("") || [];
      title.innerHTML = titleChars
        .map(
          (char) =>
            `<span class="inline-block">${
              char === " " ? "&nbsp;" : char
            }</span>`
        )
        .join("");

      gsap.fromTo(
        title.children,
        {
          opacity: 0,
          y: 50,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.03,
          duration: 0.6,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Animación del evento principal
      gsap.fromTo(
        hero,
        {
          z: -800,
          scale: 0.6,
          rotateX: 15,
          opacity: 0,
        },
        {
          z: 0,
          scale: 1,
          rotateX: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Animación columna derecha (bloques)
      if (rightCol) {
        const items = Array.from(
          rightCol.querySelectorAll<HTMLElement>(":scope > *")
        );
        gsap.from(items, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: rightCol,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        });
      }

      // Animación del título "Eventos Anteriores"
      if (pastTitle) {
        gsap.fromTo(
          pastTitle,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pastTitle,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // Animación de tarjetas del carrusel de eventos pasados
      if (pastList) {
        const cards = Array.from(pastList.children) as HTMLElement[];
        gsap.from(cards, {
          opacity: 0,
          y: 20,
          rotate: -2,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: pastList,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative w-full py-2 md:py-16"
      aria-label="Eventos de Breakout"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        {/* Título */}
        <h2
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center mb-10 md:mb-16 tracking-tight uppercase"
          style={{
            color: "#1a1a1a",
            perspective: "1000px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: "0.95",
          }}
        >
          Eventos
        </h2>

        {/* Evento Principal */}
        <div ref={heroRef} className="mb-10 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto items-start">
            {/* Columna Izquierda - Card 3D con imagen */}
            <div className="w-full">
              <MainEventCard event={mainEvent} />

              {/* Carrusel de eventos pasados - Solo imágenes */}
              <PastEventsCarousel
                events={pastEvents}
                titleRef={pastTitleRef}
                listRef={pastListRef}
              />
            </div>

            {/* Columna Derecha - Información del evento */}
            <div ref={rightColRef} className="w-full space-y-8">
              <EventDetails event={mainEvent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
