import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const TOKEN_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";

// Public routes accessible without authentication
const publicRoutes = [
  "/login",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/token",
  "/api/auth/logout",
];

/**
 * Safely decodes a JWT payload in Next.js Edge runtime
 */
function decodeJwtPayload(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Is this a public route?
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 2. Read authentication tokens from request cookies
  const accessToken = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  const adminRoleCookie = request.cookies.get("adminRole")?.value;

  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const role = payload?.role || adminRoleCookie;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  // 3. User is already authenticated and attempts to visit /login
  if (pathname === "/login") {
    if ((accessToken || refreshToken) && isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. Protected route & completely unauthenticated (no access token and no refresh token)
  if (!isPublicRoute && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. User has a token, but their role is NOT an Admin
  if (!isPublicRoute && accessToken && !isAdmin) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "forbidden");
    const response = NextResponse.redirect(loginUrl);
    // Clear cookies for unauthorized roles
    response.cookies.delete(TOKEN_COOKIE_NAME);
    response.cookies.delete(REFRESH_COOKIE_NAME);
    response.cookies.delete("adminRole");
    return response;
  }

  // 6. Authorized administrator -> Proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
