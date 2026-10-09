import { API_BASE_URL } from "@repo/shared";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token provided" },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendResponse.ok) {
      const response = NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      );
      response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("adminRole", "", { maxAge: 0, path: "/" });
      return response;
    }

    const data = await backendResponse.json().catch(() => ({}));
    const newAccessToken = data?.data?.accessToken || null;
    const newRefreshToken = data?.data?.refreshToken || null;

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });

    if (newAccessToken) {
      response.cookies.set({
        name: "accessToken",
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
      });
    }

    if (newRefreshToken) {
      response.cookies.set({
        name: "refreshToken",
        value: newRefreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error("[REFRESH PROXY ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Refresh token failed" },
      { status: 500 }
    );
  }
}
