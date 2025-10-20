"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

  // Manejador de movimiento del mouse: generar sellos por distancia (solo desktop)
  useEffect(() => {
    if (shouldReduceMotion || !mounted || isMobile) return;

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
  }, [shouldReduceMotion, mounted, isMobile]);

  // Modo móvil: imágenes flotantes sutiles en background
  useEffect(() => {
    if (!mounted || shouldReduceMotion || !isMobile) return;

    const section = sectionRef.current as HTMLElement | null;
    const layer = trailLayerRef.current as HTMLDivElement | null;
    if (!section || !layer) return;

    const wrappers: HTMLDivElement[] = [];
    const num = 7; // cantidad de fotos flotantes

    for (let i = 0; i < num; i++) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = `${Math.random() * 100}%`;
      wrapper.style.top = `${Math.random() * 100}%`;
      wrapper.style.transform = "translate(-50%, -50%)";
      wrapper.style.pointerEvents = "none";
      wrapper.style.width = `${160 + Math.random() * 60}px`;
      wrapper.style.borderRadius = "16px";
      wrapper.style.overflow = "hidden";
      wrapper.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";

      const img = document.createElement("img");
      img.src = encodeURI(
        communityImages[Math.floor(Math.random() * communityImages.length)]
      );
      img.alt = "Community";
      img.style.display = "block";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.filter = "brightness(1.05) contrast(1.05)";

      wrapper.appendChild(img);
      layer.appendChild(wrapper);
      wrappers.push(wrapper);

      gsap.set(wrapper, {
        opacity: 0.6,
        scale: 0.95,
        rotate: (Math.random() - 0.5) * 8,
      });
      // Animación sutil de vaivén más amplia y más rápida
      gsap.to(wrapper, {
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 160,
        duration: 3 + Math.random() * 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    return () => {
      wrappers.forEach((w) => w.remove());
    };
  }, [mounted, shouldReduceMotion, isMobile]);

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
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-white font-bold uppercase tracking-wider">
              Comunidad
            </span>
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="text-white/80 hover:text-white px-3 py-1 rounded-md border border-white/20"
              aria-label="Cerrar"
            >
              Cerrar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              {communityImages.map((src) => (
                <div
                  key={src}
                  className="relative w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={src}
                    alt="Community"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cursor personalizado (no usado en móvil) */}
      <style jsx>{``}</style>
    </section>
  );
}
