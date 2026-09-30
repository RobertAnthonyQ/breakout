import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const sans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Breakout — Opportunities Hub",
  description:
    "El hub de oportunidades de Breakout (ciclo 26-2): convocatorias verificadas de hackathons, subsidios no reembolsables, becas y aceleradoras para founders y builders de Latinoamérica.",
  keywords: [
    "Breakout",
    "Opportunities",
    "Hackathons",
    "StartUp Perú",
    "Y Combinator",
    "Platanus Ventures",
    "Grants",
    "Becas AI",
    "Startup Hub",
  ],
  authors: [{ name: "Breakout Tech Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} scroll-smooth`}>
      <body>
        {children}
      </body>
    </html>
  );
}
