import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */

const nextConfig = {
  // Trust X-Forwarded-Host header from reverse proxy (Nginx)
  // This fixes redirects going to localhost:3001 instead of the actual domain
  experimental: {
    serverActions: {
      allowedOrigins: ['*.nexademos.co.in'],
    },
  },

  // Note: We're not using rewrites here because Next.js API routes should be handled by Next.js
  // If you need to proxy specific backend routes, add them explicitly below
  // For now, axiosInstance already points to backend via NEXT_PUBLIC_API_BASE_URL
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;

    if (!isServer) {
      let inheritsPath;
      try {
        inheritsPath = require.resolve('inherits');
      } catch {
        inheritsPath = false;
      }

      config.resolve.fallback = {
        ...config.resolve.fallback,
        inherits: inheritsPath,
        util: require.resolve('util'),
      };
    }
    return config;
  },
};


export default nextConfig;