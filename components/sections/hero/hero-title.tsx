"use client";

import { motion } from "framer-motion";

const letter = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

function AnimatedWord({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`block ${className ?? ""}`}>
      {text.split("").map((char, index) => (
        <motion.span key={`${text}-${index}`} variants={letter} className="inline-block whitespace-pre">
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Open World pattern: first line outlined, second line solid (brand tagline "Break the limits")
export default function HeroTitle() {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
      className="font-display text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] leading-[0.88]"
      aria-label="Break the limits"
    >
      <AnimatedWord text="Break the" className="text-outline" />
      {" "}
      <AnimatedWord text="Limits" />
    </motion.h1>
  );
}
