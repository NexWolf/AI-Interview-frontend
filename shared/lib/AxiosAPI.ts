import { API_URL } from '@/constants/routes';
import axios from 'axios';

export const AxiosAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Injectable client-side navigation — set by a React component that owns the
// Next.js router.  Falls back to a hard redirect if the router hasn't been
// wired up yet (e.g. during the very first render or in non-SPA contexts).
let navigateTo: ((url: string) => void) | null = null;

export function setNavigateFn(fn: ((url: string) => void) | null) {
  navigateTo = fn;
}

function redirectToAuth() {
  if (navigateTo) {
    navigateTo('/auth');
  } else {
    window.location.href = '/auth';
  }
}

let cachedAccessToken: string | null = null;

async function fetchAccesssToken(): Promise<string | null> {
  const res = await fetch('/API/auth/token');
  const data = await res.json();
  return data.accessToken;
}

AxiosAPI.interceptors.request.use(async (config) => {
  if (!cachedAccessToken) {
    cachedAccessToken = await fetchAccesssToken();
  }

  if (cachedAccessToken) {
    config.headers.Authorization = `Bearer ${cachedAccessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (t?: string) => void;
  reject: (e: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach(({ reject, resolve }) =>
    error ? reject(error) : resolve(token ?? undefined),
  );
  pendingQueue = [];
};

AxiosAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        pendingQueue.push({ resolve, reject }),
      ).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return AxiosAPI(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const res = await fetch(`/API/auth/refresh`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        cachedAccessToken = null;
        processQueue(new Error('Session Expired'));
        redirectToAuth();
        return Promise.reject(error);
      }

      cachedAccessToken = data.accessToken;
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${cachedAccessToken}`;
      return AxiosAPI(originalRequest);
    } catch (e) {
      cachedAccessToken = null;
      processQueue(e);
      redirectToAuth();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

// import { refreshSession, getAccessToken } from "@/actions/auth";
// import { API_URL } from "@/constants/routes";
// import axios from "axios";

// export const AxiosAPI = axios.create({
//     baseURL: API_URL,
//     withCredentials: true,
// });

// // كاش بالذاكرة لتجنب استدعاء Server Action مع كل طلب
// let cachedAccessToken: string | null = null;

// export function setCachedAccessToken(token: string | null) {
//     cachedAccessToken = token;
// }

// /* REQUEST INTERCEPTOR — هاد كان الجزء الناقص أصلاً */
// AxiosAPI.interceptors.request.use(async (config) => {
//     if (!cachedAccessToken) {
//         cachedAccessToken = await getAccessToken();
//     }
//     if (cachedAccessToken) {
//         config.headers = config.headers ?? {};
//         config.headers.Authorization = `Bearer ${cachedAccessToken}`;
//     }
//     return config;
// });

// let isRefreshing = false;
// let pendingQueue: Array<{
//     resolve: (token?: string) => void;
//     reject: (err: unknown) => void;
// }> = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//     pendingQueue.forEach(({ resolve, reject }) => {
//         if (error) reject(error);
//         else resolve(token ?? undefined);
//     });
//     pendingQueue = [];
// };

// /* TAKE THE RES THATS COMES FROM BACKEND AND SEE THE REQ IF COMES REFRESH TOKEN OR ERROR */
// AxiosAPI.interceptors.response.use(
//     /* SUCCESS */
//     (response) => response,

//     /* 401 HANDLING */
//     async (error) => {
//         const originalRequest = error.config;

//         if (!error.response || error.response.status !== 401 || originalRequest._retry) {
//             return Promise.reject(error);
//         }

//         if (isRefreshing) {
//             return new Promise((resolve, reject) => {
//                 pendingQueue.push({ resolve, reject });
//             }).then((token) => {
//                 originalRequest.headers = originalRequest.headers ?? {};
//                 originalRequest.headers.Authorization = `Bearer ${token}`;
//                 return AxiosAPI(originalRequest);
//             });
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//             const newToken = await refreshSession();

//             if (!newToken) {
//                 setCachedAccessToken(null);
//                 processQueue(new Error('Session expired'));
//                 window.location.href = '/auth';
//                 return Promise.reject(error);
//             }

//             setCachedAccessToken(newToken);
//             processQueue(null, newToken);

//             originalRequest.headers = originalRequest.headers ?? {};
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return AxiosAPI(originalRequest);
//         } catch (refreshError) {
//             setCachedAccessToken(null);
//             processQueue(refreshError);
//             window.location.href = '/auth';
//             return Promise.reject(refreshError);
//         } finally {
//             isRefreshing = false;
//         }
//     }
// );
