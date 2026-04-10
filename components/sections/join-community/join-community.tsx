"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import NameSphere from "./name-sphere";
import JoinForm from "./join-form";

gsap.registerPlugin(ScrollTrigger);

// Sin nombres hardcodeados: se llenará solo desde la API
const defaultMemberNames: string[] = [];

export default function JoinCommunity() {
  const sectionRef = useRef<HTMLElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [names, setNames] = useState<string[]>(defaultMemberNames);
  const [loadingNames, setLoadingNames] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(max-width: 768px)");
      const apply = () => setIsMobile(mq.matches);
      apply();
      mq.addEventListener?.("change", apply);
      return () => mq.removeEventListener?.("change", apply);
    }
  }, []);

  // Animación de entrada de la sección y esfera
  useEffect(() => {
    if (!mounted || shouldReduceMotion) return;

    const section = sectionRef.current;
    const sphere = sphereRef.current;
    const form = formRef.current;
    const title = titleRef.current;

    if (!section || !sphere || !form || !title) return;

    const ctx = gsap.context(() => {
      // Desactivar partículas cuando esta sección entra
      ScrollTrigger.create({
        trigger: section,
        start: "top 90%",
        end: "bottom top",
        onEnter: () => document.body.classList.add("disable-particles"),
        onEnterBack: () => document.body.classList.add("disable-particles"),
        onLeave: () => document.body.classList.remove("disable-particles"),
        onLeaveBack: () => document.body.classList.remove("disable-particles"),
      });
      // Animación del título
      gsap.from(title, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
      });

      // Animación de la esfera
      gsap.from(sphere, {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        opacity: 0,
        scale: 0.7,
      });

      // Animación del formulario
      gsap.from(form, {
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top 30%",
          scrub: 1,
        },
        opacity: 0,
        y: 30,
      });
    }, section);

    return () => ctx.revert();
  }, [mounted, shouldReduceMotion]);

  // Cargar nombres desde la API (Airtable)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingNames(true);
        const res = await fetch("/api/contacts", { cache: "no-store" });
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: "" }));
          throw new Error(error || "Error cargando nombres");
        }
        const data = await res.json();
        const fetched: string[] = Array.isArray(data?.names) ? data.names : [];
        if (!cancelled) {
          setNames(fetched.map((n) => n.toUpperCase())); // reemplaza completamente
        }
      } catch {
        // Silencioso: no mostramos errores al usuario
      } finally {
        if (!cancelled) setLoadingNames(false);
      }
    }
    if (mounted) load();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  const handleNameAdded = (name: string) => {
    setNames((prev) => [name, ...prev]);
  };

  return (
    <section
      id="join"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20"
      style={{
        backgroundColor: "#000000",
      }}
      aria-label="Únete a la Comunidad"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={formRef}
          className="max-w-7xl mx-auto p-8 md:p-12 rounded-2xl"
          style={{
            background: "rgba(15, 15, 15, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px rgba(33, 79, 221, 0.12)",
          }}
        >
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white text-center mb-4 tracking-tight leading-tight"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            ÚNETE A LA{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214fdd] to-[#4a6fff]">
              COMUNIDAD
            </span>
          </h2>
          <p className="text-center text-gray-400 mb-8 md:mb-10 text-sm md:text-base">
            Llena el formulario para que tu nombre aparezca en la esfera.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Columna izquierda: Esfera de nombres */}
            <NameSphere
              names={names}
              loadingNames={loadingNames}
              isMobile={isMobile}
              shouldReduceMotion={shouldReduceMotion}
              mounted={mounted}
              sphereRef={sphereRef}
            />

            {/* Columna derecha: Formulario */}
            <JoinForm
              onNameAdded={handleNameAdded}
              sphereRef={sphereRef}
            />
          </div>
        </div>
      </div>

      {/* Sin partículas ni efectos extra: fondo liso negro */}
    </section>
  );
}
