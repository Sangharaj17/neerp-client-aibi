/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
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
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};


export default nextConfig;