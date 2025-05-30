// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        // port: '',
        // pathname: '/account123/**',
        // search: '',
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "xohcrdpzaxbcfzkxkqju.supabase.co",
      },
    ],
  },
};

export default nextConfig;
