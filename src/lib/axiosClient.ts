// src/lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s — mobile networks can be slow
});

// Auto-redirect on 401 — but NOT for auth routes (layout handles those itself)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";

    const isAuthRoute =
      url.includes("/api/auth/me") ||
      url.includes("/api/auth/logout") ||
      url.includes("/api/auth/login");

    // Only auto-redirect on 401 for non-auth routes
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isAuthRoute
    ) {
      const locale = window.location.pathname.startsWith("/en") ? "en" : "bn";
      window.location.href = `/${locale}/admin/login`;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;