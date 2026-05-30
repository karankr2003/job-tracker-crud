// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps an empty object to satisfy Next.js 16's strict bundler routing
  turbopack: {},

  // Forces the application onto the Webpack engine for your local machine
  webpack: (config) => {
    return config;
  }
};

export default nextConfig;
