"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CardBody, CardContainer, CardItem } from "@/src/components/ui/3d-card";

gsap.registerPlugin(ScrollTrigger);

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  tags: string[];
  isPast: boolean;
  registrationLink?: string;
}

const mainEvent: Event = {
  id: "main",
  title: "YOUNG (16 UNDER 29) ECOSYSTEM",
  description:
    "Únete a la nueva generación de emprendedores y innovadores en el ecosistema tech peruano. Un evento dedicado a jóvenes talentos bajo 29 años.",
  date: "4 de Octubre, 2025",
  time: "5:00 PM",
  image: "/images/events/evento-05-oct-25.jpg",
  tags: ["Networking", "Ecosystem", "Young Talents"],
  isPast: false,
  registrationLink: "#",
};

const pastEvents: Event[] = [
  {
    id: "1",
    title: "Sesión NoCode",
    description:
      "¡Transforma tus ideas en realidad de manera rápida y accesible! Con Fiorella Cisneros, Webflow Expert",
    date: "12 de Septiembre, 2024",
    time: "3:00 PM - 5:00 PM",
    image: "/images/events/evento-12-sep-24.png",
    tags: ["NoCode", "Webflow", "Workshop"],
    isPast: true,
  },
];

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
      <div className="container mx-auto px-6 md:px-10">
        {/* Título */}
        <h2
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl font-black text-center mb-12 md:mb-16 tracking-tight uppercase"
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
        <div ref={heroRef} className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
            {/* Columna Izquierda - Card 3D con imagen */}
            <div className="w-full">
              <CardContainer className="inter-var w-full">
                <CardBody className="relative group/card w-full h-auto transition-all duration-500">
                  <div
                    className="overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                      borderRadius: "24px",
                      border: "2px solid rgba(33, 79, 221, 0.15)",
                      boxShadow:
                        "0 35px 90px -20px rgba(0, 0, 0, 0.35), 0 20px 50px -15px rgba(33, 79, 221, 0.45), 0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {/* Imagen - Primera sección (1/3) */}
                    <CardItem translateZ="100" className="w-full relative">
                      <div className="w-full aspect-[4/3] relative overflow-hidden">
                        <Image
                          src={mainEvent.image}
                          alt={mainEvent.title}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                          }}
                        />
                      </div>
                    </CardItem>

                    {/* Tags - Segunda sección (1/3) */}
                    <div
                      className="p-8 flex items-center justify-center"
                      style={{ minHeight: "140px" }}
                    >
                      <CardItem translateZ="40" className="w-full">
                        <div className="flex gap-3 flex-wrap justify-center">
                          {mainEvent.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              style={{
                                backgroundColor: "#ffffff",
                                color: "#214fdd",
                                border: "2px solid #214fdd",
                                letterSpacing: "0.12em",
                                boxShadow: "0 4px 12px rgba(33, 79, 221, 0.15)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardItem>
                    </div>

                    {/* Botón CTA - Tercera sección (1/3) */}
                    <div className="px-8 pb-8" style={{ minHeight: "120px" }}>
                      <CardItem
                        translateZ="60"
                        className="w-full flex items-center justify-center"
                      >
                        <a
                          href={mainEvent.registrationLink}
                          className="group/btn flex items-center justify-center gap-3 w-full px-8 py-5 rounded-2xl text-white font-black uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-sm"
                          style={{
                            backgroundColor: "#214fdd",
                            boxShadow:
                              "0 10px 30px rgba(33, 79, 221, 0.4), 0 4px 12px rgba(33, 79, 221, 0.2)",
                            letterSpacing: "0.14em",
                          }}
                        >
                          <span>Registrarse</span>
                          <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </a>
                      </CardItem>
                    </div>
                  </div>
                </CardBody>
              </CardContainer>

              {/* Carrusel de eventos pasados - Solo imágenes */}
              <div className="mt-2">
                <h4
                  ref={pastTitleRef}
                  className="text-lg font-black uppercase tracking-wider mb-4"
                  style={{
                    color: "#1a1a1a",
                    letterSpacing: "0.1em",
                  }}
                >
                  Eventos Anteriores
                </h4>
                <div
                  ref={pastListRef}
                  className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
                >
                  {pastEvents.map((event) => (
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
            </div>

            {/* Columna Derecha - Información del evento */}
            <div ref={rightColRef} className="w-full space-y-8">
              {/* Título y descripción */}
              <div>
                <h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 uppercase"
                  style={{
                    color: "#1a1a1a",
                    letterSpacing: "-0.03em",
                    lineHeight: "0.95",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {mainEvent.title}
                </h3>
                <p
                  className="text-gray-600 text-xl leading-relaxed font-light"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {mainEvent.description}
                </p>
              </div>

              {/* Detalles del evento - Diseño elegante */}
              <div className="space-y-6 mt-10">
                {/* Fecha */}
                <div className="flex items-start gap-5">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: "#214fdd" }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                      FECHA
                    </p>
                    <p
                      className="text-2xl font-black tracking-tight"
                      style={{
                        color: "#1a1a1a",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {mainEvent.date}
                    </p>
                  </div>
                </div>

                {/* Hora */}
                <div className="flex items-start gap-5">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: "#214fdd" }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                      HORARIO
                    </p>
                    <p
                      className="text-2xl font-black tracking-tight"
                      style={{
                        color: "#1a1a1a",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {mainEvent.time}
                    </p>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-5">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: "#214fdd" }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                      UBICACIÓN
                    </p>
                    <p
                      className="text-2xl font-black tracking-tight"
                      style={{
                        color: "#1a1a1a",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Open PUCP
                    </p>
                    <p className="text-base text-gray-600 mt-1 font-light">
                      Lima, Perú
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa pequeño - Esquinas más redondeadas */}
              <div
                className="rounded-3xl overflow-hidden shadow-md"
                style={{ border: "1px solid rgba(0, 0, 0, 0.06)" }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3079447518587!2d-77.07457798582765!3d-12.07308729144574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6f7a6b7e5c1%3A0x8e8b3e3e3e3e3e3e!2sPontificia%20Universidad%20Cat%C3%B3lica%20del%20Per%C3%BA!5e0!3m2!1ses!2spe!4v1696889594362!5m2!1ses!2spe"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del evento"
                ></iframe>
              </div>

              {/* Organizadores - Elegante */}
              <div className="flex items-center gap-5 pt-8 mt-8 border-t-2 border-gray-200">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
                    style={{
                      backgroundColor: "#214fdd",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    B
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                    ORGANIZADO POR
                  </p>
                  <p
                    className="font-black text-xl tracking-tight"
                    style={{
                      color: "#1a1a1a",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Breakout Community
                  </p>
                  <p className="text-base text-gray-500 font-light mt-0.5">
                    500+ miembros activos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
