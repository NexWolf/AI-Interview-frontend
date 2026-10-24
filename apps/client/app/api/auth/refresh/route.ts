import { API_URL } from "@/constants/routes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    let refreshToken: string | null = null;
    try {
        const cookieStore = await cookies();
        refreshToken = cookieStore.get("refreshToken")?.value ?? null;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: "No refresh token provided (لم يتم توفير رمز التحديث)" },
                { status: 401 }
            );
        }

        const backendResponse = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!backendResponse.ok) {
            // Only wipe cookies if the backend explicitly rejected authentication (401 or 403)
            if (backendResponse.status === 401 || backendResponse.status === 403) {
                cookieStore.delete("accessToken");
                cookieStore.delete("refreshToken");
            }
            const backendBody = await backendResponse.text().catch(() => null);
            console.error("[REFRESH_DEBUG]", {
                hasRefreshToken: Boolean(refreshToken),
                backendStatus: backendResponse.status,
                backendBody,
                errorMessage: null,
                time: new Date().toISOString(),
            });
            return NextResponse.json(
                { success: false, message: "Refresh Failed (فشل تحديث الرمز)" },
                { status: 401 }
            );
        }

        const data = await backendResponse.json().catch(() => ({}));
        let newAccessToken: string | null = data?.data?.accessToken || null;
        let newRefreshToken: string | null = data?.data?.refreshToken || null;

        const nextCookies: Array<{ name: string; value: string; maxAge: number }> = [];

        if (newAccessToken) {
            nextCookies.push({ name: "accessToken", value: newAccessToken, maxAge: 60 * 15 });
        }
        if (newRefreshToken) {
            nextCookies.push({ name: "refreshToken", value: newRefreshToken, maxAge: 60 * 60 * 24 * 7 });
        }

        try {
            const setCookies = backendResponse.headers.getSetCookie?.() || [];
            for (const cookie of setCookies) {
                const [cookiePair] = cookie.split(";");
                const separatorIndex = cookiePair.indexOf("=");
                if (separatorIndex === -1) continue;

                const name = cookiePair.slice(0, separatorIndex).trim();
                const value = cookiePair.slice(separatorIndex + 1).trim();

                if (name === "accessToken" && !newAccessToken) {
                    newAccessToken = value;
                    nextCookies.push({ name, value, maxAge: 60 * 15 });
                }

                if (name === "refreshToken" && !newRefreshToken) {
                    nextCookies.push({ name, value, maxAge: 60 * 60 * 24 * 7 });
                }
            }
        } catch (e) {
            console.warn("Could not parse set-cookie headers:", e);
        }

        // تجهيز الـ Response النهائي
        const response = NextResponse.json({
            success: true,
            accessToken: newAccessToken
        });

        for (const { name, value, maxAge } of nextCookies) {
            response.cookies.set({
                name,
                value,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge,
            });
        }

        return response;

    } catch (error: any) {
        console.error("[REFRESH_DEBUG]", {
            hasRefreshToken: Boolean(refreshToken),
            backendStatus: null,
            backendBody: null,
            errorMessage: error?.message || String(error),
            time: new Date().toISOString(),
        });
        console.error("REFRESH PROXY ERROR: ", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong (حدث خطأ ما)" },
            { status: 500 }
        );
    }
}

