import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: "./", // Explicit path
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};
export default nextConfig;