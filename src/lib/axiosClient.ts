// src/lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,                      // ✅ sends cookies (required for auth)
  headers: {
    "Content-Type": "application/json",       // ✅ tells server to expect JSON
  },
  timeout: 10000,                             // ✅ 10s timeout (prevents hanging)
});

// Auto-redirect to login on 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const locale = window.location.pathname.startsWith("/en") ? "en" : "bn";
      window.location.href = `/${locale}/admin/login`;
    }
    return Promise.reject(error);
  }
);

export default axiosClient;