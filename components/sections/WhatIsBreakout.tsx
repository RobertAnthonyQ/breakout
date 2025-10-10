"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * WhatIsBreakout
 * UX goals
 * - Section pins on scroll and plays a clean sequence:
 *   1) Title enters then exits
 *   2) Line 1 enters from the left then exits
 *   3) Line 2 enters from the right with distinct styling
 * - Subtle motion, readable type, strong contrast. Respects prefers-reduced-motion.
 */
export default function WhatIsBreakout() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerTitleRef = useRef<HTMLDivElement | null>(null);
  const layerOneRef = useRef<HTMLDivElement | null>(null);
  const layerTwoRef = useRef<HTMLDivElement | null>(null);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const title = layerTitleRef.current;
    const one = layerOneRef.current;
    const two = layerTwoRef.current;

    if (!container || !title || !one || !two) return;

    // Reduced motion: keep it simple and avoid scroll-bound animations
    if (shouldReduceMotion) {
      const ctx = gsap.context(() => {
        gsap.set([title, one, two], { autoAlpha: 0, y: 0, x: 0 });
        gsap.to(title, { autoAlpha: 1, duration: 0.4, ease: "power1.out" });
        gsap.to(one, {
          autoAlpha: 1,
          duration: 0.4,
          delay: 0.15,
          ease: "power1.out",
        });
        gsap.to(two, {
          autoAlpha: 1,
          duration: 0.4,
          delay: 0.3,
          ease: "power1.out",
        });
      }, container);

      return () => ctx.revert();
    }

    // Full motion: pin the section and play a scrubbed timeline
    const ctx = gsap.context(() => {
      gsap.set([title, one, two], { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: "power2.out" },
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2800", // increased for more dramatic, slower animations
          scrub: 1, // slight smoothing for more fluid feel
          pin: true,
          anticipatePin: 1,
          onEnter: () => document.body.classList.add("breakout-dark"),
          onEnterBack: () => document.body.classList.add("breakout-dark"),
          onLeave: () => document.body.classList.remove("breakout-dark"),
          onLeaveBack: () => document.body.classList.remove("breakout-dark"),
        },
      });

      // 1) Title enters with explosive scale + rotation, then exits with dramatic spin
      tl.fromTo(
        title,
        {
          y: 150,
          autoAlpha: 0,
          filter: "blur(12px)",
          scale: 0.7,
          rotationX: -15,
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
          rotationX: 0,
          ease: "elastic.out(1, 0.6)",
          duration: 1.2,
        }
      )
        .to(
          title,
          {
            y: -200,
            autoAlpha: 0,
            filter: "blur(10px)",
            scale: 0.8,
            rotationX: 20,
            ease: "power4.in",
            duration: 0.7,
          },
          "+=0.15"
        )
        // 2) Line one enters diagonally with rotation, then exits with spiral effect
        .fromTo(
          one,
          {
            x: -200,
            y: 100,
            autoAlpha: 0,
            filter: "blur(8px)",
            rotationY: -25,
            scale: 0.85,
          },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            rotationY: 0,
            scale: 1,
            ease: "back.out(2)",
            duration: 1,
          },
          "-=0.3"
        )
        .to(
          one,
          {
            x: 150,
            y: -80,
            autoAlpha: 0,
            filter: "blur(3px)",
            rotationY: 20,
            scale: 0.9,
            ease: "power3.in",
            duration: 0.6,
          },
          "+=0.25"
        )
        // 3) Line two enters from bottom with powerful bounce and glowing effect
        .fromTo(
          two,
          {
            y: 250,
            autoAlpha: 0,
            filter: "blur(15px) brightness(0.5)",
            scale: 0.6,
            rotationZ: -5,
          },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px) brightness(1.3)",
            scale: 1,
            rotationZ: 0,
            ease: "elastic.out(1, 0.5)",
            duration: 1.4,
          },
          "-=0.1"
        );
    }, container);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      id="about"
      ref={containerRef}
      aria-labelledby="what-is-breakout-heading"
      className="relative w-full"
    >
      {/* A tall spacer for non-pinned environments; pinning will take over */}
      <div className="min-h-[80vh] md:min-h-[100vh] flex items-center justify-center px-6 md:px-10">
        <div className="relative w-full max-w-6xl py-16 md:py-24">
          {/* Layered stack - all centered, GSAP toggles visibility */}
          <div className="relative h-[40vh] md:h-[48vh]">
            {/* Title */}
            <div
              ref={layerTitleRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h2
                id="what-is-breakout-heading"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                style={{
                  color: "currentColor",
                  textShadow:
                    "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
                }}
              >
                What is Breakout?
              </h2>
            </div>

            {/* Line 1 - diagonal entrance with rotation, clean type */}
            <div
              ref={layerOneRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-6xl leading-tight font-medium"
                style={{ color: "currentColor" }}
              >
                <span className="font-bold">Breakout</span> connects talented
                founders with{" "}
                <span className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  world-class opportunities
                </span>
                .
              </p>
            </div>

            {/* Line 2 - bottom entrance with bounce, glowing blue accent */}
            <div
              ref={layerTwoRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-6xl leading-tight font-medium"
                style={{ color: "currentColor" }}
              >
                <span className="align-middle"> From exclusive programs</span>
                <span
                  className="mx-3 align-middle"
                  style={{ color: "currentColor", opacity: 0.8 }}
                >
                  to
                </span>
                <span
                  className="align-middle font-black"
                  style={{
                    color: "#214fdd",
                    textShadow:
                      "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4), 0 0 90px rgba(59, 130, 246, 0.2)",
                    filter: "brightness(1.2)",
                  }}
                >
                  powerful fellowships
                </span>
                <span className="align-middle text-white">.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
