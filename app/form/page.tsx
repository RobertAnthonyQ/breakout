"use client";

import Image from "next/image";
import Link from "next/link";
import FellowshipForm from "@/components/forms/fellowship-form";

export default function ApplicationFormPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--bo-ink)] relative overflow-hidden">

      {/* Header */}
      <header className="relative z-20 border-b border-[var(--bo-line)]">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <Link href="/" aria-label="Breakout — inicio">
            <Image src="/logo-breakout-cobalt.png" alt="Breakout" width={640} height={104} priority className="h-6 sm:h-7 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm sm:text-base text-[var(--bo-muted)] hover:text-[var(--bo-cobalt)] transition-colors"
          >
            ← Volver
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-20 container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.9] mb-3 sm:mb-4">
              <span className="text-outline inline-block">Breakout</span>{" "}
              <span className="text-[var(--bo-cobalt)] inline-block">Fellowship</span>
            </h1>
            <p className="text-[var(--bo-muted)] text-base sm:text-lg px-4">
              Completa el formulario para ser parte del programa de desarrollo
              de innovadores y emprendedores
            </p>
          </div>

          {/* Formulario */}
          <FellowshipForm />

          {/* Nota al pie */}
          <p className="text-center text-[var(--bo-muted)] text-xs sm:text-sm mt-6 sm:mt-8 px-4">
            Al enviar esta aplicación, aceptas que tu información será revisada
            por el equipo del Breakout Fellowship
          </p>
        </div>
      </main>
    </div>
  );
}
