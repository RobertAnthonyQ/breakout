"use client";

import { motion, AnimatePresence } from "framer-motion";
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
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
