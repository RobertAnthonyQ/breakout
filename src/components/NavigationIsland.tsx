"use client";

import React from "react";
import Link from "next/link";

interface NavigationIslandProps {
  onOpenSubmit?: () => void;
}

export function NavigationIsland({ onOpenSubmit }: NavigationIslandProps) {
  return (
    <nav className="nav-bar">
      <div className="brand-group">
        <Link href="/" className="brand-link" aria-label="Breakout — inicio">
          <img src="/logo-breakout-white.png" alt="Breakout" className="brand-logo" />
        </Link>
        <span className="hub-pill">Opportunities</span>
      </div>

      <div className="nav-links">
        <a href="#convocatorias" className="nav-link">
          Convocatorias
        </a>
        <a
          href="https://www.instagram.com/breakout_community/"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
        >
          Martes de Oportunidades
        </a>
      </div>

      <button type="button" onClick={onOpenSubmit} className="btn-on-blue">
        Sugerir oportunidad
      </button>
    </nav>
  );
}
