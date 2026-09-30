import path from "node:path";
import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

// This app lives in opportunities/ of the Breakout landing repo, which has its own
// package-lock.json at the root. Pin the project root so Next doesn't pick the landing's.
const HUB_ROOT = path.resolve(__dirname);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  // Served at breakout.lat/opportunities via a rewrite in the landing (Next multi-zones)
  basePath: BASE_PATH,
  turbopack: { root: HUB_ROOT },
  outputFileTracingRoot: HUB_ROOT,
};

export default nextConfig;
