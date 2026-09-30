"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLightSection } from "@/hooks/use-light-section";
import NavLinks from "./nav-links";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLight = useLightSection();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // White logo and links on cobalt sections, cobalt/ink on white ones; solid bar once scrolled
  const onLight = isLight && !isMenuOpen;
  const barClass = isScrolled && !isMenuOpen
    ? onLight
      ? "bg-white/95 border-b border-[var(--bo-line)]"
      : "bg-[var(--bo-cobalt)]/95 border-b border-white/15"
    : "bg-transparent border-b border-transparent";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 lg:px-16 py-4 transition-colors duration-500 ${barClass}`}
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link href="/" className="relative z-[100]" aria-label="Breakout — inicio">
          <Image
            src={onLight ? "/logo-breakout-cobalt.png" : "/logo-breakout-white.png"}
            alt="Breakout"
            width={640}
            height={104}
            priority
            className="h-6 sm:h-7 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-10 xl:gap-14">
          <NavLinks
            linkClassName={`text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
              onLight ? "text-[var(--bo-text)] hover:text-[var(--bo-cobalt)]" : "text-white/85 hover:text-white"
            }`}
          />
        </nav>

        <a
          href="/form"
          className={`group hidden lg:inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-full text-sm transition-colors ${
            onLight
              ? "bg-[var(--bo-cobalt)] text-white hover:bg-[var(--bo-cobalt-700)]"
              : "bg-white text-[var(--bo-cobalt)] hover:bg-[var(--bo-cobalt-50)]"
          }`}
        >
          Aplicar al Fellowship
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>

        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`lg:hidden justify-self-end relative z-[100] ${onLight ? "text-[var(--bo-ink)]" : "text-white"}`}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </motion.header>
  );
}
