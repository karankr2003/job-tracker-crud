import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for deployment to avoid junction point issues on Windows
  // and use Webpack instead for more stable builds
  webpack: (config) => {
    return config;
  }
};

export default nextConfig;
