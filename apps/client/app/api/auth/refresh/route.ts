import { API_URL } from "@/constants/routes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Single-flight in-memory deduplication map to prevent race conditions during refresh
const inFlightRefreshes = new Map<
  string,
  Promise<{ ok: boolean; status: number; data: any; setCookies: string[] }>
>();

async function executeBackendRefresh(refreshToken: string) {
  let pending = inFlightRefreshes.get(refreshToken);
  if (!pending) {
    pending = fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (backendResponse) => {
        const data = await backendResponse.json().catch(() => ({}));
        const setCookies = backendResponse.headers.getSetCookie?.() || [];
        return {
          ok: backendResponse.ok,
          status: backendResponse.status,
          data,
          setCookies,
        };
      })
      .finally(() => {
        inFlightRefreshes.delete(refreshToken);
      });

    inFlightRefreshes.set(refreshToken, pending);
  }
  return pending;
}

export async function POST() {
  let refreshToken: string | null = null;
  try {
    const cookieStore = await cookies();
    refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    if (!refreshToken) {
      const response = NextResponse.json(
        { success: false, message: "No refresh token provided" },
        { status: 401 }
      );
      response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("onboardingDone", "", { maxAge: 0, path: "/" });
      return response;
    }

    const backendResult = await executeBackendRefresh(refreshToken);

    if (!backendResult.ok) {
      const response = NextResponse.json(
        { success: false, message: "Refresh Failed" },
        { status: 401 }
      );
      // Wipe auth cookies if the backend explicitly rejected authentication (any 4xx error)
      if (backendResult.status >= 400 && backendResult.status < 500) {
        response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
        response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
        response.cookies.set("onboardingDone", "", { maxAge: 0, path: "/" });
      }
      return response;
    }

    const data = backendResult.data;
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
      const setCookies = backendResult.setCookies || [];
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

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
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
    console.error("REFRESH PROXY ERROR: ", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
