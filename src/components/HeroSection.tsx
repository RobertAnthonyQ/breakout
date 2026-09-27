import React from "react";
import { OpportunityStats } from "../../types";

interface HeroSectionProps {
  stats: OpportunityStats;
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="eyebrow-capsule">
        <span className="pulse-dot"></span>
        CONVOCATORIAS VERIFICADAS · CICLO 26-2
      </div>

      <h1 className="hero-title">
        El radar de oportunidades en{" "}
        <span className="hero-title-gradient">Tech, Startups y Capital</span>
      </h1>

      <p className="hero-subtitle">
        Grants no reembolsables de ProInnóvate, hackathons internacionales, aceleradoras de clase mundial y becas de especialización. Todo curado en un solo lugar.
      </p>

      <div className="stats-ribbon">
        <span>
          <strong>+$850,000 USD</strong> en fondos activos
        </span>
        <span className="stats-dot">·</span>
        <span className="accent-blue">● 100% Verificadas</span>
        <span className="stats-dot">·</span>
        <span>
          <strong>{stats.total} convocatorias</strong> activas para builders
        </span>
      </div>
    </section>
  );
}
