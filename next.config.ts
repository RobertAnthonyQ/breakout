import type { NextConfig } from "next";

// The Opportunities Hub is its own app (repo Loopmind-hub/breakout-opportunities, basePath
// "/opportunities"); breakout.lat/opportunities proxies to it (Next multi-zones).
// Override with OPPORTUNITIES_HUB_URL; locally run the hub with `bunx next dev -p 3001`.
const OPPORTUNITIES_HUB_URL =
  process.env.OPPORTUNITIES_HUB_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://breakout-opportunities-hub.vercel.app");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/opportunities", destination: `${OPPORTUNITIES_HUB_URL}/opportunities` },
      { source: "/opportunities/:path*", destination: `${OPPORTUNITIES_HUB_URL}/opportunities/:path*` },
    ];
  },
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
