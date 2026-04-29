/** @type {import('next').NextConfig} */

// Server-only: where /api/* gets proxied to.
// - Local dev (host):    http://localhost:3002    (host port mapped to backend container's 3001)
// - Docker compose:      http://backend:3001      (internal service-to-service)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'backend' },
      { protocol: 'http', hostname: 'minio' },
    ],
  },
};

export default nextConfig;
