import axios, { InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_URL ||
  "https://ai-interview.apps.taqat.academy";

export const AxiosAPI = axios.create({
  baseURL: API_BASE_URL,
});

let cachedAccessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setCachedAccessToken(token: string | null) {
  cachedAccessToken = token;
}

export function clearCachedAccessToken() {
  cachedAccessToken = null;
  refreshPromise = null;
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now() + 15000;
  } catch {
    return true;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "same-origin",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.accessToken) {
        cachedAccessToken = null;
        return null;
      }

      cachedAccessToken = data.accessToken;
      return data.accessToken;
    } catch (err) {
      console.error("[AxiosAPI] Error refreshing token:", err);
      cachedAccessToken = null;
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function getValidAccessToken(): Promise<string | null> {
  if (cachedAccessToken && !isTokenExpired(cachedAccessToken)) {
    return cachedAccessToken;
  }
  return refreshAccessToken();
}

AxiosAPI.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    cachedAccessToken && !isTokenExpired(cachedAccessToken)
      ? cachedAccessToken
      : null;

  if (token && config.headers) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

AxiosAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newToken = await refreshAccessToken();

    if (!newToken) {
      if (typeof window !== "undefined") {
        document.cookie = "onboardingDone=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/auth";
      }
      return Promise.reject(error);
    }

    if (originalRequest.headers) {
      if (typeof originalRequest.headers.set === "function") {
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
      } else {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
    }

    return AxiosAPI(originalRequest);
  }
);
