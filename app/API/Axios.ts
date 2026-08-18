import { refreshSession } from "@/actions/auth";
import axios from "axios";

export const AxiosAPI = axios.create({
    baseURL : "/api"
})

let isRefreshing = false;
let pendingQueue : Array<{
    resolve : (token : string) => void;
    reject : (err : unknown) => void;
}> = [];

const processQueue = (error : unknown , token : string |null) => {
    pendingQueue.forEach(({resolve , reject}) => {
        if(token) resolve(token);
        else reject(error);
    });
    pendingQueue = [];
}

/* TAKE THE RES THATS COMES FROM BACKEND AND SEE THE REQ IF COMES REFRESH TOKEN OR ERROR */
AxiosAPI.interceptors.response.use(
    /* REFRESH TOKEN SUCCESS */
    (response) => response,


    /* REFRESH TOKEN FAILED */
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if(isRefreshing) {
            return new Promise((resolve , reject) => {
                pendingQueue.push({resolve , reject});
            }).then ((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return AxiosAPI(originalRequest);
            })
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newToken = await refreshSession();

            if(!newToken) {
                processQueue(new Error('Session expired'), null);
                window.location.href='/auth';
                return Promise.reject(error);
            }

            processQueue(null, newToken);
            originalRequest.headers['Authorization'] = `Bearer , ${newToken}`
            return AxiosAPI(originalRequest);
        }catch(refreshError) {
            processQueue(refreshError , null);
            window.location.href = '/auth';
        }
        finally{
            isRefreshing = false;
        }
    }
)