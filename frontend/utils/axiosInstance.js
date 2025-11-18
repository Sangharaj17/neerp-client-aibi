import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Attach tenant before every request
axiosInstance.interceptors.request.use(
  (config) => {
    let tenant = undefined;
    try {
      tenant = localStorage.getItem("tenant");
    } catch (_) {
      // ignore if not available (SSR)
    }

    if (typeof location !== 'undefined' && location.hostname === 'localhost') {
      // On localhost, always prefer full host with port (e.g., localhost:3000)
      tenant = location.port ? `localhost:${location.port}` : 'localhost';
  } else if (!tenant && typeof location !== 'undefined') {
    // For deployed environments: use hostname (+ port if present) as default tenant
    tenant = location.port
      ? `${location.hostname}:${location.port}`
      : location.hostname;
  }

  if (!tenant && typeof document !== 'undefined') {
    // Final fallback to cookie set by middleware
    const match = document.cookie.match(/(?:^|; )tenant=([^;]+)/);
    if (match) {
      tenant = decodeURIComponent(match[1]);
    }
    }
    if (tenant) {
      config.headers["X-Tenant"] = tenant;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
