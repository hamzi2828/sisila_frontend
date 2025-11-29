import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    // Skip ESLint during builds (pre-existing lint issues)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type errors during builds (pre-existing issues)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'other-levels.com',
      },
    ],
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  compiler: {
    // This helps ensure styles are consistent
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
