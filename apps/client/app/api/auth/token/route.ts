import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper function to check if the JWT token is expired (or about to expire within 30 seconds)
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadDecoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payload = JSON.parse(payloadDecoded);
    
    if (!payload.exp) return true; 

    const expirationTime = payload.exp * 1000;
    const nowWithBuffer = Date.now() + 30000; 

    return expirationTime < nowWithBuffer;
  } catch {
    return true;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;

    // Fast path: return access token only if valid. 
    // This route DOES NOT refresh from backend to prevent race conditions with /api/auth/refresh.
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.json({ accessToken });
    }

    return NextResponse.json({ accessToken: null }, { status: 401 });
  } catch (error) {
    console.error("[Token Route] Error:", error);
    return NextResponse.json({ accessToken: null }, { status: 500 });
  }
}