import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AmbientBackground } from "../src/components/AmbientBackground";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Breakout — Opportunities Hub (Apple Frosted Glass Edition)",
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
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body className={inter.className}>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
