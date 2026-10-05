import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad — Breakout",
  description: "Cómo Breakout recopila, usa y protege tus datos personales.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--bo-ink)]">
      <header className="border-b border-[var(--bo-line)]">
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

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--bo-ink)] mb-2">
            Política de privacidad
          </h1>
          <p className="text-[var(--bo-muted)] text-sm mb-10">Última actualización: octubre de 2026</p>

          <div className="space-y-8 text-[var(--bo-text)] leading-relaxed">
            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Quiénes somos</h2>
              <p>
                Breakout es una comunidad estudiantil de innovación y emprendimiento. Somos responsables
                del tratamiento de los datos personales que nos compartes a través de{" "}
                <span className="font-semibold">breakout.lat</span> y del Hub de Oportunidades. Puedes
                escribirnos a{" "}
                <a href="mailto:breakout.fellow@gmail.com" className="text-[var(--bo-cobalt)] underline">
                  breakout.fellow@gmail.com
                </a>{" "}
                para cualquier consulta sobre esta política.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Qué datos recopilamos</h2>
              <p>
                Cuando te unes a la comunidad a través de nuestro formulario, pedimos: nombre, teléfono,
                ocupación, ciudad y país. Estos datos son los necesarios para agregarte al grupo de
                WhatsApp de la comunidad y para contactarte sobre eventos y oportunidades relevantes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Para qué los usamos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Agregarte al grupo de WhatsApp de Breakout.</li>
                <li>Contactarte sobre eventos, talleres y oportunidades de la comunidad.</li>
                <li>
                  Mostrar tu nombre públicamente dentro de la comunidad, solo si tú decides activar esa
                  opción al unirte (no es obligatorio para formar parte del grupo).
                </li>
              </ul>
              <p className="mt-2">No vendemos ni compartimos tus datos con terceros fuera de la operación de Breakout.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Base legal</h2>
              <p>
                Tratamos tus datos con tu consentimiento expreso, otorgado al marcar la casilla
                correspondiente en nuestro formulario, conforme a la Ley N° 29733 — Ley de Protección de
                Datos Personales del Perú y su reglamento.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Cuánto tiempo los conservamos</h2>
              <p>
                Conservamos tus datos mientras seas parte de la comunidad, o hasta que nos pidas
                eliminarlos.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Tus derechos</h2>
              <p>
                Puedes pedirnos acceder, rectificar, cancelar u oponerte al uso de tus datos (derechos
                ARCO) en cualquier momento, escribiendo a{" "}
                <a href="mailto:breakout.fellow@gmail.com" className="text-[var(--bo-cobalt)] underline">
                  breakout.fellow@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[var(--bo-ink)] mb-2">Cambios a esta política</h2>
              <p>
                Si actualizamos esta política, publicaremos la nueva versión en esta misma página con su
                fecha de actualización.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
