/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lhfkyswksqxwzuowcpam.supabase.co', // <-- Add this hostname
        // You can optionally add port and pathname if needed, but hostname is usually enough
      },
      // You might add other hostnames here in the future
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
