import React from "react";
import { WireGlobe } from "./WireGlobe";

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="hero-eyebrow">Convocatorias verificadas</p>

        <h1 className="hero-title">
          <span className="hero-title-outline">El radar de</span>
          <span className="hero-title-solid">Oportunidades</span>
        </h1>
        <span className="hero-bar" aria-hidden="true" />

        <p className="hero-topics">Startups · IA · Becas · Capital</p>
        <p className="hero-subtitle">
          Grants no reembolsables, hackathons, aceleradoras, becas y programas de research, curados por Breakout en un solo lugar.
        </p>
      </div>

      <dl className="hero-stats">
        <div>
          <dt>Convocatorias</dt>
          <dd>+300</dd>
        </div>
        <div>
          <dt>De dólares en fondos activos</dt>
          <dd>Millones</dd>
        </div>
      </dl>

      <WireGlobe className="hero-globe" />
    </section>
  );
}
