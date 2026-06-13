"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroCta() {
  return (
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
        <a href="/form" className="flex items-center">
          <ArrowRight className="mr-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          Aplicar al Fellowship
        </a>
      </Button>
    </motion.div>
  );
}
