'use server'

import { API_URL } from "@/constants/routes";
import axios from "axios";
import { cookies } from "next/headers";

export async function createSession(token: string, refreshToken: string) {
    const cookieStore = await cookies();

    cookieStore.set('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
}

export async function refreshSession(): Promise<string | null> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) return null;

    const refresh_Url = `${API_URL}/api/v1/auth/refresh`;

    try {
        const res = await axios.post(
            refresh_Url,
            { refreshToken },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    // ملاحظة: تم حذف هيدر Authorization هون عمدًا، راجع الشرح لاحقًا
                }
            }
        );

        const newAccessToken: string = res.data?.data?.access_token;
        const newRefreshToken: string = res.data?.data?.refresh_token ?? refreshToken;

        if (!newAccessToken) {
            console.error('Refresh response missing access_token:', res.data);
            await clearSession();
            return null;
        }

        await createSession(newAccessToken, newRefreshToken);

        return newAccessToken;
    } catch (e) {
        console.error('Refresh token failed, logging out:', e);
        await clearSession();
        return null;
    }
}

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('accessToken')?.value ?? null;
}

export async function getMe() {
    const { AxiosServerAPI } = await import('@/shared/lib/AxiosServerAPI');
    const cookieStore = await cookies();
    let token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    try {
        const res = await AxiosServerAPI.get(`/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data.client;
    } catch (e: any) {
        if (e?.response?.status === 401) {
            const newToken = await refreshSession();
            if (newToken) {
                try {
                    const retryRes = await AxiosServerAPI.get(`/api/v1/auth/me`, {
                        headers: { Authorization: `Bearer ${newToken}` },
                    });
                    return retryRes.data.data.client;
                } catch (retryErr) {
                    console.error('Retry /me failed:', retryErr);
                }
            }
        }
        console.error('Failed to fetch /me:', e);
        return null;
    }
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (token) {
        const client = await getMe();
        if (client) return { ...client, isAdmin: false };
    }
    return null;
}