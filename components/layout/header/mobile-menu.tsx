"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          className="fixed inset-0 bg-black/95 z-[60] lg:hidden pt-24 px-8"
        >
          <nav className="flex flex-col items-center gap-8">
            <NavLinks
              onLinkClick={onClose}
              linkClassName="text-white hover:text-gray-300 transition-colors text-2xl font-semibold uppercase tracking-[0.15em]"
            />

            <Button
              asChild
              className="bg-[#214fdd] hover:bg-[#1a3fb8] text-white font-bold px-8 py-6 rounded-full text-lg transition-all duration-300 group mt-8"
            >
              <a
                href="/form"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Aplicar al Fellowship
              </a>
            </Button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
