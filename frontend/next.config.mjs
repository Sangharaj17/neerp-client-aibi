/** @type {import('next').NextConfig} */

const nextConfig = {
    // Note: We're not using rewrites here because Next.js API routes should be handled by Next.js
    // If you need to proxy specific backend routes, add them explicitly below
    // For now, axiosInstance already points to backend via NEXT_PUBLIC_API_BASE_URL
  };
  
  export default nextConfig;