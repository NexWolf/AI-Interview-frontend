import { API_URL } from "@/constants/routes";
import axios from "axios";
import { cookies } from "next/headers";

export const AxiosServerAPI = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

AxiosServerAPI.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const allCookies = cookieStore.toString();
    if (allCookies) {
        config.headers.Cookie = allCookies;
    }

    config.headers["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  config.headers["Accept"] = "application/json, text/plain, */*";

    return config;
})

AxiosServerAPI.interceptors.response.use(
    (response) => response,


    async (error) => {
        const originRequest = error.config;
        if (error.response?.status !== 401 || originRequest._retry) {
            return Promise.reject(error);
        }

        originRequest._retry = true;

        try {
            const { refreshSession } = await import("@/actions/auth");
            const newToken = await refreshSession();

            if (!newToken) return Promise.reject(error);

            originRequest.headers["Authorization"] = `Bearer ${newToken}`
            return AxiosServerAPI(originRequest)
        } catch (e) {
            return Promise.reject(e)
        }
    }
)

