"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Niebla de fondo */}
      <div className="absolute inset-0 gradient-bg z-0" />
      {/* Partículas por encima de la niebla y por debajo del contenido */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.2,
                },
              },
            }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tight mb-10 text-white leading-none"
            style={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {/* En móvil muestra BREAK y COMMUNITY en dos líneas */}
            <span className="block sm:hidden">
              {"BREAKOUT".split("").map((char, index) => (
                <motion.span
                  key={`break-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              <br />
              <span className="text-4xl">
                {"COMMUNITY".split("").map((char, index) => (
                  <motion.span
                    key={`community-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: "easeOut",
                        },
                      },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </span>
            {/* En pantallas más grandes muestra BREAKOUT */}
            <span className="hidden sm:block">
              {"BREAKOUT".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 sm:mt-12 md:mt-16"
          >
            <Button
              asChild
              size="lg"
              className="group bg-[#214fdd] hover:bg-[#1a3fb8] text-white font-bold px-8 py-5 sm:px-10 sm:py-7 rounded-full text-lg sm:text-xl transition-all duration-300"
            >
              <a href="https://luma.com/ozb7ghkp" className="flex items-center">
                <ArrowRight className="mr-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                Únete Ahora
              </a>
            </Button>
          </motion.div>
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
