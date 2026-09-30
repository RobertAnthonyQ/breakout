import React from "react";
import { Instagram, Linkedin } from "./BrandIcons";
import { withBasePath } from "../lib/base-path";

interface FooterIslandProps {
  onOpenSubmit?: () => void;
}

export function FooterIsland({ onOpenSubmit }: FooterIslandProps) {
  return (
    <footer className="footer-band">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={withBasePath("/logo-breakout-white.png")} alt="Breakout" className="footer-logo" />
          <p className="footer-motto" aria-label="Break the limits.">
            <span className="footer-motto-outline">Break the</span> limits.
          </p>
          <p className="footer-meta">Tech Area · Ciclo 26-2 · Director: Freddy Ñañez</p>
        </div>

        <div className="footer-links">
          <a
            href="https://www.instagram.com/breakout_community/"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </a>
          <a
            href="https://www.linkedin.com/company/breakoutperu/"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
          <button type="button" onClick={onOpenSubmit} className="btn-on-blue">
            Sugerir oportunidad
          </button>
        </div>
      </div>
    </footer>
  );
}
