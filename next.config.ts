import type { NextConfig } from "next";
import { env } from '@env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/events',
        permanent: false
      }
    ]
  }
};

export default nextConfig;
