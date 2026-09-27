import React from "react";

interface FooterIslandProps {
  onOpenSubmit?: () => void;
}

export function FooterIsland({ onOpenSubmit }: FooterIslandProps) {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <strong>BRE▲KOUT</strong>
        <span>·</span>
        <span>Tech Area · Ciclo 26-2</span>
        <span>·</span>
        <span>Director: Freddy Ñañez</span>
      </div>

      <div className="footer-links">
        <a
          href="https://breakout.lat"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          Landing Principal
        </a>
        <a
          href="https://breakly.breakout.lat"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          Breakly
        </a>
        <a
          href="https://instagram.com/breakoutlatam"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          Martes de Oportunidades
        </a>
        <button
          type="button"
          onClick={onOpenSubmit}
          className="footer-link highlight bg-transparent border-none cursor-pointer p-0"
        >
          Sugerir Convocatoria
        </button>
      </div>
    </footer>
  );
}
