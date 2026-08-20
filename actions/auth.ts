'use server'

import { API_URL } from "@/constants/routes";
import axios from "axios";
import { cookies } from "next/headers";

export async function createSession(token : string , refreshToken : string)  {
    const cookieStore = await cookies();

    cookieStore.set('accessToken' , token , {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'lax',
        path : '/',
    })

    cookieStore.set('refreshToken' , refreshToken , {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'lax',
        path : '/'
    })
}

export async function refreshSession() : Promise<string | null>{
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if(!refreshToken) return null;

    const refresh_Url = `${API_URL}/api/v1/auth/refresh`

    try{ 
        const res = await axios.post(
            refresh_Url,
            {refreshToken : refreshToken},
            {headers : {'Content-Type' : 'application/json'}}
        )

        const newAccessToken : string = res.data.data.access_token;
        const newRefreshToken : string = res.data.data.refresh_token ?? refreshToken;

        await createSession(newAccessToken, newRefreshToken);

        return newAccessToken
    }catch (e) {
        console.log('Refresh token failed , logging out : ', e);
        return null;
    }
}

export async function getMe () {
    const {AxiosServerAPI} = await import ('@/app/API/AxiosServer');
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if(!token) return null;

    try {
        const res = await AxiosServerAPI.get(`/api/v1/auth/me`, {
            headers : {Authorization : `Bearer ${token}`},
        })

        return res.data.data.client;
    }catch(e) {
        console.log('Failed to fetch /me', e);
        return null;
    } 
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    

    if(token){
        const client = await getMe();
        if(client) return {...client , isAdmin : false}
    }
}