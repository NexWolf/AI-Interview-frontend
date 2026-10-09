import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@repo/shared";

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payloadDecoded = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadDecoded);
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now() + 30000;
  } catch {
    return true;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.json({ accessToken });
    }

    if (!refreshToken) {
      return NextResponse.json({ accessToken: null }, { status: 401 });
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendResponse.ok) {
      const response = NextResponse.json({ accessToken: null }, { status: 401 });
      response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
      return response;
    }

    const data = await backendResponse.json().catch(() => ({}));
    const newAccessToken = data?.data?.accessToken || null;
    const newRefreshToken = data?.data?.refreshToken || null;

    if (!newAccessToken) {
      return NextResponse.json({ accessToken: null }, { status: 401 });
    }

    const response = NextResponse.json({ accessToken: newAccessToken });
    response.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

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
    console.error("[Token Route] Error:", error);
    return NextResponse.json({ accessToken: null }, { status: 500 });
  }
}
