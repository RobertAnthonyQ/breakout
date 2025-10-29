import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "BREAKOUT - La comunidad de founders de Latinoamérica",
    description:
      "Conectamos emprendedores, desarrolladores y visionarios tech para crear el futuro de las startups",
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
        className={`${inter.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
