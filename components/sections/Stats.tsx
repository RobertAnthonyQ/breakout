"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Miembros" },
  { value: 50, suffix: "+", label: "Eventos" },
  { value: 20, suffix: "+", label: "Startups" },
  { value: 15, suffix: "+", label: "Speakers" },
];

export default function Stats() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const validStats = statsRef.current.filter((el) => el !== null);
    if (validStats.length === 0) return;

    if (shouldReduceMotion) {
      // Simple fade in for reduced motion
      const ctx = gsap.context(() => {
        gsap.fromTo(
          validStats,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }
        );

        // Animate numbers without scroll trigger
        validStats.forEach((stat, index) => {
          const numberEl = stat?.querySelector(".stat-number");
          if (numberEl) {
            const target = stats[index].value;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 1.5,
              delay: 0.3,
              ease: "power2.out",
              onUpdate: () => {
                numberEl.textContent = Math.floor(counter.val).toString();
              },
            });
          }
        });
      }, container);

      return () => ctx.revert();
    }

    // Full animation with scroll trigger
    const ctx = gsap.context(() => {
      gsap.set(validStats, { y: 120, autoAlpha: 0, scale: 0.8 });

      // Animate stats entering from bottom
      gsap.to(validStats, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
        },
      });

      // Animate the numbers counting up with scroll - optimized with scrub
      validStats.forEach((stat, index) => {
        const numberEl = stat?.querySelector(".stat-number");
        if (numberEl) {
          const target = stats[index].value;
          const counter = { val: 0 };

          gsap.to(counter, {
            val: target,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 1,
              onUpdate: (self) => {
                const progress = self.progress;
                numberEl.textContent = Math.floor(target * progress).toString();
              },
            },
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent text-white py-24 md:py-32"
      aria-label="Estadísticas de Breakout"
    >
      {/* Content with minimal glassmorphism */}
      <div className="container mx-auto px-6 md:px-10 relative z-10">
        {/* Minimal glass container */}
        <div
          className="p-8 md:p-12 rounded-3xl"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                ref={(el) => {
                  statsRef.current[index] = el;
                }}
                className="flex flex-col items-center justify-center text-center space-y-3"
              >
                {/* Number with glow effect */}
                <div className="relative">
                  <div className="text-5xl sm:text-6xl md:text-7xl font-black flex items-center justify-center gap-1">
                    <span
                      className="stat-number"
                      style={{
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))",
                      }}
                    >
                      0
                    </span>
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))",
                      }}
                    >
                      {stat.suffix}
                    </span>
                  </div>
                </div>

                {/* Label */}
                <p
                  className="stat-label text-lg sm:text-xl md:text-2xl font-medium text-white/80 tracking-wide"
                  style={{
                    transition: "color 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Decorative line */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div
              className="h-[2px] w-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.5) 50%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
