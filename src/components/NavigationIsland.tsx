"use client";

import React from "react";
import Link from "next/link";

interface NavigationIslandProps {
  onOpenSubmit?: () => void;
}

export function NavigationIsland({ onOpenSubmit }: NavigationIslandProps) {
  return (
    <div className="nav-container">
      <nav className="nav-island">
        <div className="brand-group">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo-breakout.svg" 
              alt="Breakout Logo" 
              className="h-[28px] w-auto" 
            />
            <span className="brand-wordmark">
              BRE<span className="triangle-logo">▲</span>KOUT
            </span>
          </Link>
          <div className="hub-pill">Opportunities</div>
        </div>

        <div className="nav-links">
          <a href="#convocatorias" className="nav-link active">
            Convocatorias
          </a>
          <a
            href="https://instagram.com/breakoutlatam"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Martes de Oportunidades
          </a>
          <a
            href="https://breakly.breakout.lat"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Breakly
          </a>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            onClick={onOpenSubmit}
            className="btn-apple-primary"
          >
            <span>Sugerir oportunidad</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
