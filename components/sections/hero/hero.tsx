"use client";

import { motion } from "framer-motion";
import ParticlesBackground from "@/components/layout/particles-background";
import HeroTitle from "./hero-title";
import HeroCta from "./hero-cta";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Niebla de fondo */}
      <div className="absolute inset-0 gradient-bg z-0" />
      {/* Particulas por encima de la niebla y por debajo del contenido */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle />
          <HeroCta />
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute -bottom-40 sm:-bottom-48 md:-bottom-56 lg:-bottom-44 xl:-bottom-40 left-0 right-0 flex justify-between items-end px-4 sm:px-8 md:px-12 text-white"
        >
          <div className="text-left">
            <p className="text-xs sm:text-sm md:text-base lg:text-xl font-semibold">
              INNOVATION
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-xl font-semibold">
              STARTUPS
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm md:text-base lg:text-xl font-semibold">
              TECHNOLOGY
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
