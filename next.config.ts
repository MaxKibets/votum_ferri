import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  optimizePackageImports: ["lucide-react"],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
