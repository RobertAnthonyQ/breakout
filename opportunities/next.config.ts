import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  // Served at breakout.lat/opportunities via a rewrite in the landing (Next multi-zones)
  basePath: BASE_PATH,
};

export default nextConfig;
