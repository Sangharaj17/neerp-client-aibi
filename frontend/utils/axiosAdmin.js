// axiosAdmin.js
import axios from "axios";

const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

const axiosAdmin = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default axiosAdmin;
