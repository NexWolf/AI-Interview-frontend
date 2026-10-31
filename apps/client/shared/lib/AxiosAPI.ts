import { API_URL } from "@/constants/routes";
import axios, { InternalAxiosRequestConfig } from "axios";

export const AxiosAPI = axios.create({
  baseURL: API_URL,
});

let cachedAccessToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;
let candidateToken: string | null = null;

export function setCandidateToken(token: string | null) {
  candidateToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem("candidate_access_token", token);
    } else {
      sessionStorage.removeItem("candidate_access_token");
    }
  }
}

export function getCandidateToken(): string | null {
  if (candidateToken) return candidateToken;
  if (typeof window !== "undefined") {
    candidateToken = sessionStorage.getItem("candidate_access_token");
  }
  return candidateToken;
}

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
export async function getValidAccessToken(): Promise<string | null> {
  // If running on server (SSR / Server Component), avoid calling relative client routes
  if (typeof window === "undefined") {
    return null;
  }

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
  let token = await getValidAccessToken();

  if (!token) {
    token = getCandidateToken();
  }

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
// SHARED TOKEN REFRESH & RESPONSE INTERCEPTOR
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

/**
 * Executes a single-flight token refresh against /api/auth/refresh.
 * Shared between AxiosAPI 401 interceptor and interview socket connect_error handler.
 */
export async function refreshAccessTokenDirectly(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const candidate = getCandidateToken();
  if (candidate) {
    return candidate;
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    }).catch(() => null);
  }

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
      return null;
    }

    const newToken: string = data.accessToken;
    cachedAccessToken = newToken;
    processQueue(null, newToken);
    return newToken;
  } catch (refreshErr) {
    cachedAccessToken = null;
    processQueue(refreshErr);
    return null;
  } finally {
    isRefreshing = false;
  }
}

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

    originalRequest._retry = true;

    const newToken = await refreshAccessTokenDirectly();
    if (!newToken) {
      if (typeof window !== "undefined") {
        const isCandidateSession =
          Boolean(getCandidateToken()) ||
          window.location.pathname.startsWith("/interview/");
        if (!isCandidateSession) {
          window.location.href = "/auth";
        }
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
