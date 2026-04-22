import axios, { AxiosRequestHeaders } from "axios";
import { getDefaultStore } from "jotai";
import { toast } from "@/components/ui/use-toast";
import { authAtom, INITIAL_AUTHENTICATION_VALUE } from "../hooks/useAuth";

let API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
if (API_URL === "http://localhost:") {
  API_URL = "http://localhost:5000";
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const api = axios.create({
  baseURL: API_URL,
});

// Helper to subscribe to token refresh
function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

// Helper to notify all subscribers with new token
function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Helper to get access token from store
async function getAccessToken() {
  const store = getDefaultStore();
  return (await store.get(authAtom))?.accessToken;
}

// Helper to set new tokens in store
async function setTokens(accessToken: string, refreshToken: string) {
  const store = getDefaultStore();
  const auth = await store.get(authAtom);
  store.set(authAtom, {
    ...auth,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
}

// Request interceptor: attach access token
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers || {} as AxiosRequestHeaders;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already trying to refresh
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh/token")
    ) {
      originalRequest._retry = true;

      const store = getDefaultStore();
      const auth = await store.get(authAtom);

      // If no refresh token, logout
      if (!auth?.refreshToken) {
        store.set(authAtom, INITIAL_AUTHENTICATION_VALUE);
        toast({
          title: "Unauthorized",
          description: "Session expired. Please log in again.",
        });
        return Promise.reject(error);
      }

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token: string | null) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh token
        const refreshToken = auth.refreshToken;
        const res = await api.post<{ accessToken: string; refreshToken: string }>(
          "/api/auth/refresh/token",
          { refresh_token: refreshToken }
        );
        const newAccess = res.data.accessToken;
        const newRefresh = res.data.refreshToken || refreshToken;

        await setTokens(newAccess, newRefresh);

        onRefreshed(newAccess);
        isRefreshing = false;

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(null); // Notify subscribers of failure
        store.set(authAtom, INITIAL_AUTHENTICATION_VALUE);
        toast({
          title: "Session Expired",
          description: "Please log in again.",
        });
        return Promise.reject(refreshError);
      }
    }

    // If refresh token request itself failed, logout immediately
    if (
      error?.response?.status === 401 &&
      error?.config?.url?.includes("/api/auth/refresh/token")
    ) {
      const store = getDefaultStore();
      store.set(authAtom, INITIAL_AUTHENTICATION_VALUE);
      toast({
        title: "Session Expired",
        description: "Please log in again.",
      });
      return Promise.reject(error);
    }

    // Other errors
    toast({
      title: "Error",
      description: error?.response?.data?.message || "An error occurred.",
    });
    return Promise.reject(error);
  }
);

export default api;
