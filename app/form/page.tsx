"use client";

import Link from "next/link";
import ParticlesBackground from "@/components/layout/particles-background";
import FellowshipForm from "@/components/forms/fellowship-form";

export default function ApplicationFormPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 gradient-bg z-0" />

      {/* Partículas de fondo */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-black tracking-tight hover:text-[#214fdd] transition-colors"
          >
            BREAKOUT®
          </Link>
          <Link
            href="/"
            className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214fdd] to-[#4a6fff]">
                BREAKOUT FELLOWSHIP
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg px-4">
              Completa el formulario para ser parte del programa de desarrollo
              de innovadores y emprendedores
            </p>
          </div>

          {/* Formulario */}
          <FellowshipForm />

          {/* Nota al pie */}
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 px-4">
            Al enviar esta aplicación, aceptas que tu información será revisada
            por el equipo del Breakout Fellowship
          </p>
        </div>
      </main>
    </div>
  );
}
