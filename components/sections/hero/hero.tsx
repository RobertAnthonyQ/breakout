"use client";

import { motion } from "framer-motion";
import ParticlesBackground from "@/components/layout/particles-background";
import HeroTitle from "./hero-title";

// Blue brand register: cobalt page, white wireframe particles, Open World headline
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden text-white">
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/80 mb-6"
        >
          Comunidad de innovación y emprendimiento
        </motion.p>

        <HeroTitle />

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="block h-1 w-20 bg-white origin-left mt-8 mb-6"
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-lg sm:text-2xl font-semibold"
        >
          Innovation · Startups · Technology
        </motion.p>
      </div>
    </section>
  );
}
