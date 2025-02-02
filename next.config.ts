import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
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
