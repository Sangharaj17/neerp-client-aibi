// axiosAdmin.js
import axios from "axios";

// Fallback to local backend if env is not set (prevents ERR_INVALID_URL on SSR)
const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || "https://neerp-client-aibi-backend.scrollconnect.com";

const axiosAdmin = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default axiosAdmin;
