import { refreshSession, getAccessToken } from "@/actions/auth";
import { API_URL } from "@/constants/routes";
import axios from "axios";

export const AxiosAPI = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// كاش بالذاكرة لتجنب استدعاء Server Action مع كل طلب
let cachedAccessToken: string | null = null;

export function setCachedAccessToken(token: string | null) {
    cachedAccessToken = token;
}

/* REQUEST INTERCEPTOR — هاد كان الجزء الناقص أصلاً */
AxiosAPI.interceptors.request.use(async (config) => {
    if (!cachedAccessToken) {
        cachedAccessToken = await getAccessToken();
    }
    if (cachedAccessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${cachedAccessToken}`;
    }
    return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
    resolve: (token?: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token ?? undefined);
    });
    pendingQueue = [];
};

/* TAKE THE RES THATS COMES FROM BACKEND AND SEE THE REQ IF COMES REFRESH TOKEN OR ERROR */
AxiosAPI.interceptors.response.use(
    /* SUCCESS */
    (response) => response,

    /* 401 HANDLING */
    async (error) => {
        const originalRequest = error.config;

        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return AxiosAPI(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newToken = await refreshSession();

            if (!newToken) {
                setCachedAccessToken(null);
                processQueue(new Error('Session expired'));
                window.location.href = '/auth';
                return Promise.reject(error);
            }

            setCachedAccessToken(newToken);
            processQueue(null, newToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return AxiosAPI(originalRequest);
        } catch (refreshError) {
            setCachedAccessToken(null);
            processQueue(refreshError);
            window.location.href = '/auth';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);