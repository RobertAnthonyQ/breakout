"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLinks from "./nav-links";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
          <NavLinks />
        </nav>

        {/* CTA Button */}
        <Button
          asChild
          className="bg-[#214fdd] hover:bg-[#1a3fb8] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-300 group hidden lg:flex items-center gap-2"
        >
          <a href="/form">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Aplicar al Fellowship
          </a>
        </Button>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white relative z-[100]"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
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
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </motion.header>
  );
}
