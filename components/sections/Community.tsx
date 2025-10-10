"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Array de imágenes de la comunidad
const communityImages = [
  "/images/community/Imagen de WhatsApp 2025-10-08 a las 00.46.04_ff6c92e3.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-08 a las 00.46.05_31edea7f.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-08 a las 00.46.07_e952a977.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.53_1207618e.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.53_461a3530.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.53_48d248c9.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.54_69f165f5.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.54_8bb979e8.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.54_9ea45946.jpg",
  "/images/community/Imagen de WhatsApp 2025-10-10 a las 01.28.54_dc1a2cfb.jpg",
];

export default function Community() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const trailLayerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);

  // Marcar montaje para evitar hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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
            `<span class="inline-block opacity-0" style="transform: translateY(60px)">${
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
          duration: 0.6,
        });

      const animateOut = () =>
        gsap.to(title.children, {
          opacity: 0,
          y: 60,
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

  // Manejador de movimiento del mouse: generar sellos por distancia
  useEffect(() => {
    if (shouldReduceMotion || !mounted) return;

    const section = sectionRef.current as HTMLElement | null;
    const layer = trailLayerRef.current as HTMLDivElement | null;
    if (!section || !layer) return;

    let lastX = -10000;
    let lastY = -10000;
    const thresholdPx = 180; // más distancia requerida entre sellos
    const minIntervalMs = 160; // tiempo mínimo entre sellos
    const maxNodes = 7; // menos elementos simultáneos
    let lastSpawnAt = 0;

    function spawnStamp(x: number, y: number) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = `${x}px`;
      wrapper.style.top = `${y}px`;
      wrapper.style.transform = "translate(-50%, -50%)";
      wrapper.style.pointerEvents = "none";
      wrapper.style.width = "260px";
      wrapper.style.height = "auto";
      wrapper.style.borderRadius = "0px";
      wrapper.style.overflow = "visible";

      const img = document.createElement("img");
      img.src = encodeURI(
        communityImages[Math.floor(Math.random() * communityImages.length)]
      );
      img.alt = "Community";
      img.style.display = "block";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.filter = "brightness(1.1) contrast(1.05)";
      wrapper.appendChild(img);

      layer!.appendChild(wrapper);

      gsap.set(wrapper, {
        opacity: 0,
        scale: 0.8,
        rotate: Math.random() * 12 - 6,
      });
      gsap.to(wrapper, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      const lifespan = 1.5;
      gsap.to(wrapper, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.inOut",
        delay: lifespan,
        onComplete: () => {
          if (wrapper.parentNode === layer) layer!.removeChild(wrapper);
        },
      });

      while (layer!.children.length > maxNodes) {
        layer!.removeChild(layer!.firstChild as Node);
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const now = performance.now();
      if (dist >= thresholdPx && now - lastSpawnAt >= minIntervalMs) {
        lastX = x;
        lastY = y;
        lastSpawnAt = now;
        spawnStamp(x, y);
      }
    }

    function handleMouseLeave() {
      lastX = -10000;
      lastY = -10000;
    }

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldReduceMotion, mounted]);

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
        className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black text-center tracking-tighter uppercase select-none relative z-50"
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

      {/* Cursor personalizado */}
      <style jsx>{``}</style>
    </section>
  );
}
