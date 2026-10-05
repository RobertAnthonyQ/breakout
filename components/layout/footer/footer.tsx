import Image from "next/image";

// Blue brand band that closes the page, mirroring the Opportunities Hub footer
const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/breakout_community/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/breakoutperu/" },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/H57OlPIk33v75h9ZE6u1zs" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bo-cobalt)] text-white px-6 sm:px-10 lg:px-16 pt-16 pb-12">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div>
          <Image src="/logo-breakout-white.png" alt="Breakout" width={640} height={104} className="h-7 w-auto mb-6" />
          <p className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.9]" aria-label="Break the limits. Build the future.">
            <span className="text-outline">Break the limits.</span>
            <br />
            Build the future.
          </p>
          <p className="text-sm text-white/70 mt-4">
            © 2026 Breakout ·{" "}
            <a href="mailto:breakout.fellow@gmail.com" className="underline hover:text-white">
              breakout.fellow@gmail.com
            </a>{" "}
            ·{" "}
            <a href="/privacidad" className="underline hover:text-white">
              Política de privacidad
            </a>
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium" aria-label="Enlaces del pie de página">
          <a href="/opportunities" className="text-white/85 hover:text-white transition-colors">
            Opportunities
          </a>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-white/85 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
