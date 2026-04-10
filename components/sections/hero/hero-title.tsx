"use client";

import { motion } from "framer-motion";

export default function HeroTitle() {
  return (
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
      {/* En movil muestra BREAK y COMMUNITY en dos lineas */}
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
      {/* En pantallas mas grandes muestra BREAKOUT */}
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
  );
}
