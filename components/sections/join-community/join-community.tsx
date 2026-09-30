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
      // White register while the section fills the screen (header switches to cobalt)
      ScrollTrigger.create({
        trigger: section,
        start: "top 10%",
        end: "bottom 10%",
        toggleClass: { targets: document.body, className: "join-light" },
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
        backgroundColor: "#ffffff",
      }}
      aria-label="Únete a la Comunidad"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={formRef}
          className="max-w-7xl mx-auto p-2 md:p-6"
        >
          <h2
            ref={titleRef}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-center mb-4 leading-[0.9] text-[var(--bo-ink)]"
          >
            <span className="text-outline inline-block">Únete a la</span>{" "}
            <span className="text-[var(--bo-cobalt)] inline-block">comunidad</span>
          </h2>
          <p className="text-center text-[var(--bo-muted)] mb-8 md:mb-10 text-sm md:text-base">
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

    </section>
  );
}
