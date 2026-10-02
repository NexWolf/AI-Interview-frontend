import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/constants/routes";

// Helper function to check if the JWT token is expired (or about to expire within 30 seconds)
function isTokenExpired(token: string): boolean {
  try {
    // A JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (Base64 URL encoded)
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadDecoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payload = JSON.parse(payloadDecoded);
    
    if (!payload.exp) return true; 

    // Calculate expiration in milliseconds and add a 30-second buffer
    const expirationTime = payload.exp * 1000;
    const nowWithBuffer = Date.now() + 30000; 

    return expirationTime < nowWithBuffer;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat as expired if we can't parse it
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("accessToken")?.value ?? null;
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    // 1. FAST PATH: If we have an access token and it is NOT expired, return it immediately.
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.json({ accessToken });
    }

    // 2. LOGOUT PATH: If we don't have a refresh token, we can't refresh. The user is essentially logged out.
    if (!refreshToken) {
      return NextResponse.json({ accessToken: null }, { status: 401 });
    }

    // 3. AUTO-REFRESH PATH: Access token is missing or expired, but we have a refresh token.
    console.log("[Token Route] Access token expired. Attempting silent refresh...");
    
    const backendResponse = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    // If backend rejects the refresh token, delete cookies and return 401
    if (!backendResponse.ok) {
      console.warn("[Token Route] Refresh token rejected by backend.");
      const response = NextResponse.json({ accessToken: null }, { status: 401 });
      response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
      return response;
    }

    // Parse the new cookies from the backend response
    let newAccessToken: string | null = null;
    const setCookies = backendResponse.headers.getSetCookie();
    const nextCookies: Array<{ name: string; value: string; maxAge: number }> = [];

    for (const cookie of setCookies) {
      const [cookiePair] = cookie.split(";");
      const separatorIndex = cookiePair.indexOf("=");
      if (separatorIndex === -1) continue;
      
      const name = cookiePair.slice(0, separatorIndex).trim();
      const value = cookiePair.slice(separatorIndex + 1).trim();

      if (name === "accessToken") {
        newAccessToken = value;
        nextCookies.push({ name, value, maxAge: 60 * 15 });
      }

      if (name === "refreshToken") {
        nextCookies.push({ name, value, maxAge: 60 * 60 * 24 * 7 });
      }
    }

    // If backend somehow returned ok but no access token was set in cookies
    if (!newAccessToken) {
      return NextResponse.json({ accessToken: null }, { status: 401 });
    }

    // Create response and apply the new cookies to the client browser
    const response = NextResponse.json({ accessToken: newAccessToken });
    
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

    console.log("[Token Route] Successfully refreshed token.");
    return response;

  } catch (error) {
    console.error("[Token Route] Error:", error);
    return NextResponse.json({ accessToken: null }, { status: 500 });
  }
}