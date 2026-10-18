import { API_URL } from "@/constants/routes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON request." }, { status: 400 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_URL.replace(/\/$/, "")}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
      cache: "no-store",
    });
  } catch (error) {
    const failure = error as { name?: string; cause?: { code?: string } };
    const timeout = failure.name === "TimeoutError" || failure.name === "AbortError";
    // Never log credentials, request bodies, tokens, or a database URL.
    console.error("Login backend request failed", { name: failure.name, code: failure.cause?.code });
    return NextResponse.json({
      success: false,
      code: timeout ? "AUTH_BACKEND_TIMEOUT" : "AUTH_BACKEND_UNAVAILABLE",
      message: timeout
        ? "The backend took too long to respond. Please try again."
        : "Cannot connect to the backend API. Make sure the backend server is running.",
    }, { status: timeout ? 504 : 503 });
  }

  let data;
  try {
    data = await backendResponse.json();
  } catch {
    return NextResponse.json({ success: false, message: "The backend returned an invalid response." }, { status: 502 });
  }
  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  let accessToken = data?.data?.accessToken;
  let refreshToken = data?.data?.refreshToken;
  // Preserve the compatibility fallback for cookies set by the backend.
  for (const cookie of backendResponse.headers.getSetCookie?.() || []) {
    const pair = cookie.split(";")[0];
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (name === "accessToken" && !accessToken) accessToken = value;
    if (name === "refreshToken" && !refreshToken) refreshToken = value;
  }
  if (typeof accessToken !== "string" || !accessToken || typeof refreshToken !== "string" || !refreshToken) {
    return NextResponse.json({ success: false, message: "The backend did not return valid login tokens." }, { status: 502 });
  }

  const response = NextResponse.json(data);
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  response.cookies.set("accessToken", accessToken, { ...cookieOptions, maxAge: 60 * 15 });
  response.cookies.set("refreshToken", refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 });
  response.cookies.set("onboardingDone", String(Boolean(data?.data?.user?.onboardingDone)), {
    ...cookieOptions, httpOnly: false, maxAge: 60 * 60 * 24 * 24,
  });
  return response;
}
