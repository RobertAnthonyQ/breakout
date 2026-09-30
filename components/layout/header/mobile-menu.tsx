"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import NavLinks from "./nav-links";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[var(--bo-cobalt)] z-[60] lg:hidden pt-28 px-8"
        >
          <nav className="flex flex-col items-center gap-8">
            <NavLinks
              onLinkClick={onClose}
              linkClassName="font-display text-white hover:text-white/70 transition-colors text-5xl"
            />

            <a
              href="/form"
              onClick={onClose}
              className="group mt-8 inline-flex items-center gap-2 bg-white text-[var(--bo-cobalt)] font-semibold px-8 py-4 rounded-full text-lg"
            >
              Aplicar al Fellowship
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
