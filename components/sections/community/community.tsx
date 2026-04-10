"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { communityImages } from "./community.data";
import { useImageTrail } from "./image-trail";
import { useFloatingImages } from "./floating-images";
import { ImageGalleryModal } from "./image-gallery-modal";

gsap.registerPlugin(ScrollTrigger);

export default function Community() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const trailLayerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Marcar montaje para evitar hydration issues
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

  // GSAP title animation + ScrollTrigger
  useEffect(() => {
    if (!mounted) return;

    const section = sectionRef.current;
    const title = titleRef.current;

    if (!section || !title) return;

    if (shouldReduceMotion) {
      gsap.set(title, { autoAlpha: 1 });
      return;
    }

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
      // Animación del título letra por letra: visible dentro de la sección, desaparece solo al subir
      const titleText = "COMMUNITY";
      const titleChars = titleText.split("");
      title.innerHTML = titleChars
        .map(
          (char) =>
            `<span class="inline-block opacity-0" style="transform: translateY(30px)">${
              char === " " ? "&nbsp;" : char
            }</span>`
        )
        .join("");

      const animateIn = () =>
        gsap.to(title.children, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          duration: 0.45,
        });

      const animateOut = () =>
        gsap.to(title.children, {
          opacity: 0,
          y: 30,
          stagger: 0.04,
          ease: "power2.in",
          duration: 0.5,
        });

      ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom top",
        onEnter: animateIn,
        onEnterBack: animateIn,
        onLeaveBack: animateOut, // Solo desaparece al subir y salir por arriba
      });

      // No se preparan elementos aquí; se crearán dinámicamente al mover el cursor
    }, section);

    return () => ctx.revert();
  }, [shouldReduceMotion, mounted]);

  // Desktop mouse trail effect
  useImageTrail(
    sectionRef,
    trailLayerRef,
    communityImages,
    !shouldReduceMotion && mounted && !isMobile
  );

  // Mobile floating images effect
  useFloatingImages(
    trailLayerRef,
    communityImages,
    mounted && !shouldReduceMotion && isMobile
  );

  return (
    <section
      id="community"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#000000",
      }}
      aria-label="Comunidad Breakout"
    >
      {/* Título principal */}
      <h2
        ref={titleRef}
        className="text-5xl sm:text-7xl md:text-8xl lg:text-[11rem] font-black text-center tracking-tighter uppercase select-none relative z-50"
        style={{
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.05em",
          lineHeight: "0.9",
          perspective: "1000px",
        }}
      >
        COMMUNITY
      </h2>

      {/* Capa para "sellar" imágenes dentro de la sección */}
      <div
        ref={trailLayerRef}
        className="absolute inset-0 pointer-events-none z-40"
        style={{ willChange: "transform" }}
      />

      {/* CTA móvil: Explorar Comunidad */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50 md:hidden">
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="bg-[#214fdd] text-white font-bold px-6 py-4 rounded-full text-sm tracking-wider uppercase shadow-lg active:scale-[0.98]"
        >
          Explorar Comunidad
        </button>
      </div>

      {/* Overlay de galería simple */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={communityImages}
      />

      {/* Cursor personalizado (no usado en móvil) */}
      <style jsx>{``}</style>
    </section>
  );
}
