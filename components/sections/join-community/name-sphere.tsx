"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

interface NameSphereProps {
  names: string[];
  loadingNames: boolean;
  isMobile: boolean;
  shouldReduceMotion: boolean;
  mounted: boolean;
  sphereRef: React.RefObject<HTMLDivElement | null>;
}

export default function NameSphere({
  names,
  loadingNames,
  isMobile,
  shouldReduceMotion,
  mounted,
  sphereRef,
}: NameSphereProps) {
  // Configurar la esfera con nombres distribuidos esféricamente
  useEffect(() => {
    if (!mounted || !sphereRef.current) return;

    const sphere = sphereRef.current;
    const wordElements = sphere.querySelectorAll(".sphere-word");
    const containerRect = sphere.getBoundingClientRect();
    const containerSize = Math.min(containerRect.width, containerRect.height);
    const radius = Math.max(140, containerSize * 0.46);
    const total = wordElements.length;

    wordElements.forEach((el, i) => {
      // Distribución esférica uniforme usando el algoritmo de Fibonacci
      const phi = Math.acos(-1 + (2 * i + 1) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      gsap.set(el, {
        x,
        y,
        z,
        opacity: 0.5 + (z / radius + 1) * 0.25, // Profundidad
        scale: 0.7 + (z / radius + 1) * 0.15,
      });
    });

    if (shouldReduceMotion) return;

    // Interacción con mouse para rotación dinámica + billboarding
    let targetRotationX = 15;
    let rotationX = 15;
    let rotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sphere.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = (e.clientX - centerX) / rect.width;
      const mouseY = (e.clientY - centerY) / rect.height;

      targetRotationX = 15 + mouseY * 20;
      rotationY += mouseX * 0.5; // ligero delta adicional según mouse
    };

    const updateRotation = () => {
      // avance suave
      rotationX += (targetRotationX - rotationX) * 0.06;
      rotationY += 0.2;

      // aplicar rotación del grupo
      gsap.set(sphere, { rotationX, rotationY });

      // billboarding: cada palabra mira al frente (inversa del grupo)
      wordElements.forEach((el) => {
        gsap.set(el, { rotationX: -rotationX, rotationY: -rotationY });
      });

      animationFrameId = requestAnimationFrame(updateRotation);
    };

    let animationFrameId = requestAnimationFrame(updateRotation);

    window.addEventListener("mousemove", handleMouseMove);

    // Hover en palabras individuales
    wordElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          scale: 1.4,
          color: "#214fdd",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        const z = gsap.getProperty(el, "z") as number;
        const baseScale = 0.7 + (z / radius + 1) * 0.15;
        gsap.to(el, {
          scale: baseScale,
          color: "#ffffff",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, shouldReduceMotion, names, sphereRef]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Esfera 3D con nombres */}
      <div
        className="relative w-full max-w-[320px] h-[320px] sm:max-w-[420px] sm:h-[420px] md:max-w-[520px] md:h-[520px] lg:max-w-[600px] lg:h-[600px] flex items-center justify-center"
        style={{
          perspective: "1200px",
        }}
      >
        <div
          ref={sphereRef}
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(15deg)",
          }}
        >
          {names.map((name, index) => (
            <div
              key={index}
              className="sphere-word absolute left-1/2 top-1/2 text-white font-bold cursor-pointer select-none whitespace-nowrap transition-colors duration-300 will-change-transform"
              style={{
                fontSize: `${(isMobile
                  ? 0.9 + Math.random() * 0.4
                  : 1.1 + Math.random() * 0.6
                ).toFixed(2)}rem`,
                transform: "translate(-50%, -50%)",
                transformStyle: "preserve-3d",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {name}
            </div>
          ))}
          {names.length === 0 && !loadingNames && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
              Sin nombres aún
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
