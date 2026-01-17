import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh state
let isRefreshing = false;

// Queue failed requests while refresh is happening
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If request has no config, reject immediately
    if (!originalRequest) return Promise.reject(error);

    // ❗ We do NOT retry /auth/me — user may just not be logged in
    // Suppress 401 errors for /auth/me from console (expected behavior)
    if (originalRequest.url?.includes("/auth/me") && error.response?.status === 401) {
      // Silently reject - this is expected when user is not logged in
      return Promise.reject(error);
    }

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already happening → queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Refresh token
        await api.post("/auth/refresh-token", {});

        // Resume queued requests
        processQueue(null);
        isRefreshing = false;

        // Retry original failed request
        return api(originalRequest);
      } catch (refreshErr) {
        // Tell all queued requests the refresh failed
        processQueue(refreshErr);
        isRefreshing = false;

        // Redirect ONLY if user is not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
