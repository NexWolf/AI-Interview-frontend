import { API_URL } from "@/constants/routes";
import axios, { InternalAxiosRequestConfig } from "axios";

export const AxiosAPI = axios.create({
  baseURL: API_URL,
});

let cachedAccessToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

export function setCachedAccessToken(token: string | null) {
  cachedAccessToken = token;
}

export function clearCachedAccessToken() {
  cachedAccessToken = null;
  tokenPromise = null;
}

/**
 * Checks if a JWT token is expired or will expire within 15 seconds.
 */
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
    // Buffer of 15 seconds to prevent near-expiry edge cases
    return payload.exp * 1000 < Date.now() + 15000;
  } catch {
    return true;
  }
}

/**
 * Deduplicated token fetcher to prevent race conditions during cold start.
 * If multiple parallel requests fire while token is null/expired, only ONE network call to /api/auth/token is made.
 */
async function getValidAccessToken(): Promise<string | null> {
  // Fast path: cached and still valid
  if (cachedAccessToken && !isTokenExpired(cachedAccessToken)) {
    return cachedAccessToken;
  }

  // Deduplication: if another request is already fetching, reuse its promise
  if (!tokenPromise) {
    tokenPromise = fetch("/api/auth/token", {
      method: "GET",
      credentials: "same-origin",
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json().catch(() => ({}));
        return data?.accessToken || null;
      })
      .then((token) => {
        cachedAccessToken = token;
        return token;
      })
      .catch((err) => {
        console.error("[AxiosAPI] Error fetching access token:", err);
        cachedAccessToken = null;
        return null;
      })
      .finally(() => {
        tokenPromise = null;
      });
  }

  return tokenPromise;
}

// =========================================================================
// REQUEST INTERCEPTOR: Proactive Token Injection
// =========================================================================
AxiosAPI.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getValidAccessToken();

  if (token && config.headers) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// =========================================================================
// RESPONSE INTERCEPTOR: Reactive 401 Handling with Deduplicated Queue
// =========================================================================
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach(({ reject, resolve }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    } else {
      reject(new Error("Session expired"));
    }
  });
  pendingQueue = [];
};

AxiosAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Ignore non-401 errors or already retried requests
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    // If another request is currently refreshing the session, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          if (typeof originalRequest.headers.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
        }
        originalRequest._retry = true;
        return AxiosAPI(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await fetch(`/api/auth/refresh`, {
        method: "POST",
        credentials: "same-origin",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.accessToken) {
        cachedAccessToken = null;
        processQueue(new Error("Session Expired"));
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }

      const newToken = data.accessToken;
      cachedAccessToken = newToken;
      processQueue(null, newToken);

      if (originalRequest.headers) {
        if (typeof originalRequest.headers.set === "function") {
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        } else {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
      }

      return AxiosAPI(originalRequest);
    } catch (refreshErr) {
      cachedAccessToken = null;
      processQueue(refreshErr);
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);