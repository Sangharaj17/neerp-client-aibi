import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Attach tenant before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const tenant = localStorage.getItem("tenant");
    if (tenant) {
      config.headers["X-Tenant"] = tenant;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
