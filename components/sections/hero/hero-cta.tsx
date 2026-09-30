"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="mt-10"
    >
      <a
        href="/form"
        className="group inline-flex items-center gap-2 bg-white text-[var(--bo-cobalt)] hover:bg-[var(--bo-cobalt-50)] font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-colors"
      >
        Aplicar al Fellowship
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </a>
    </motion.div>
  );
}
