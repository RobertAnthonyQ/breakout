"use client";

import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import type { Event } from "./events.data";

interface MainEventCardProps {
  event: Event;
}

export default function MainEventCard({ event }: MainEventCardProps) {
  return (
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
                src={event.image}
                alt={event.title}
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
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                href="/form"
                className="group/btn flex items-center justify-center gap-3 w-full px-6 py-4 sm:px-8 sm:py-5 rounded-2xl text-white font-black uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-xs sm:text-sm"
                style={{
                  backgroundColor: "#214fdd",
                  boxShadow:
                    "0 10px 30px rgba(33, 79, 221, 0.4), 0 4px 12px rgba(33, 79, 221, 0.2)",
                  letterSpacing: "0.14em",
                }}
              >
                <span>Aplicar al Fellowship</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
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
  );
}
