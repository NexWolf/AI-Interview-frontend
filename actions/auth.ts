'use server'

import { cookies } from "next/headers";
import { AxiosServerAPI } from "@/shared/lib/AxiosServerAPI";

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('accessToken')?.value ?? null;
}

export async function getMe() {
    try {
        // الـ Interceptor المحدث سيتولى عملية الـ Refresh تلقائياً عبر الـ Route Handler عند حدوث 401
        const res = await AxiosServerAPI.get(`/api/v1/auth/me`);
        return res.data?.data?.user ?? null;
    } catch (e) {
        console.error('Failed to fetch /me:', e);
        return null;
    }
}

export async function getCurrentUser() {
    const user = await getMe();
    if (user) return { ...user, isAdmin: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' };
    return null;
}