import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_AUTH_URL: process.env.NEXT_AUTH_SECRET,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.pagar.me',
      },
    ],
  },
};

export default nextConfig;
