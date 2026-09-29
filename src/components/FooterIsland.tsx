import React from "react";
import { Instagram, Linkedin } from "./BrandIcons";

interface FooterIslandProps {
  onOpenSubmit?: () => void;
}

export function FooterIsland({ onOpenSubmit }: FooterIslandProps) {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <strong>BRE▲KOUT</strong>
        <span className="hidden sm:inline">·</span>
        <span>Tech Area · Ciclo 26-2</span>
        <span className="hidden sm:inline">·</span>
        <span>Director: Freddy Ñañez</span>
      </div>

      <div className="footer-links">
        <a
          href="https://www.instagram.com/breakout_community/"
          target="_blank"
          rel="noreferrer"
          className="footer-link flex items-center gap-2 hover:text-[#214FDD]"
        >
          <Instagram className="w-4 h-4" />
          <span className="hidden sm:inline">Instagram</span>
        </a>
        <a
          href="https://www.linkedin.com/company/breakoutperu/"
          target="_blank"
          rel="noreferrer"
          className="footer-link flex items-center gap-2 hover:text-[#214FDD]"
        >
          <Linkedin className="w-4 h-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
        <button
          type="button"
          onClick={onOpenSubmit}
          className="footer-link highlight bg-transparent border-none cursor-pointer p-0"
        >
          Sugerir oportunidad
        </button>
      </div>
    </footer>
  );
}
