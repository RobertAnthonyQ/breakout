import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "globe.gl", "react-globe.gl"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    // Ignorar errores de TypeScript durante el build en producción
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
