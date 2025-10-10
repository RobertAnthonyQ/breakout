"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-8"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white font-bold text-base tracking-tight"
        >
          BREAKOUT®
        </motion.div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-40">
          <a
            href="#about"
            className="text-white hover:text-gray-300 transition-colors text-sm font-semibold uppercase tracking-[0.15em]"
          >
            About Us
          </a>
          <a
            href="#events"
            className="text-white hover:text-gray-300 transition-colors text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Events
          </a>
          <a
            href="#community"
            className="text-white hover:text-gray-300 transition-colors text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Community
          </a>
          <a
            href="#join"
            className="text-white hover:text-gray-300 transition-colors text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Join
          </a>
        </nav>

        {/* CTA Button */}
        <Button
          asChild
          className="bg-[#214fdd] hover:bg-[#1a3fb8] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-300 group hidden lg:flex items-center gap-2"
        >
          <a href="#join">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Únete Ahora
          </a>
        </Button>

        {/* Mobile menu button */}
        <button className="lg:hidden text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
