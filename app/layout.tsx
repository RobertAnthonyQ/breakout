import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";

// Breakout design system: Bebas Neue for display headlines, Poppins for everything else
// (breakout-info/org-hub/identity/brand/design-system.md)
const display = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sans = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.breakout.lat"),
  title: "BREAKOUT - La comunidad de founders de Latinoamérica",
  description:
    "Conectamos emprendedores, desarrolladores y visionarios tech para crear el futuro de las startups",
  keywords: [
    "breakout",
    "tech community",
    "latinoamérica",
    "startups",
    "desarrolladores",
    "emprendedores",
    "networking",
  ],
  authors: [{ name: "BREAKOUT" }],
  creator: "BREAKOUT",
  publisher: "BREAKOUT",
  openGraph: {
    title: "BREAKOUT - La comunidad de founders de Latinoamérica",
    description:
      "Conectamos emprendedores, desarrolladores y visionarios tech para crear el futuro de las startups",
    type: "website",
    locale: "es_LA",
    siteName: "BREAKOUT",
    url: "https://www.breakout.lat",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Breakout" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BREAKOUT - La comunidad de founders de Latinoamérica",
    description:
      "Conectamos emprendedores, desarrolladores y visionarios tech para crear el futuro de las startups",
    images: ["/og-image.png"],
  },
  robots: {
    
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Agrega aquí tus códigos de verificación cuando los tengas
    // google: 'tu-codigo-aqui',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body
        className={`${display.variable} ${sans.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
