import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disabled: Next.js's auto-generated AGENTS.md/CLAUDE.md at the repo root
  // would collide in name (not path) with Contera's own /agents Context
  // System directory. This is a tooling default, not a Contera decision.
  agentRules: false,
};

export default nextConfig;
