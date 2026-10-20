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

  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const role = payload?.role;
  const isCompany = role === "COMPANY" || role === "ADMIN" || role === "SUPER_ADMIN";

  const hasValidAccessToken = !!payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();

  // 3. User is already authenticated and attempts to visit /login
  if (pathname === "/login") {
    if (hasValidAccessToken && isCompany) {
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

  // 5. User has a token, but their role is NOT a Company Recruiter or Admin
  if (!isPublicRoute && accessToken && !isCompany) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "forbidden");
    const response = NextResponse.redirect(loginUrl);
    // Clear cookies for unauthorized roles
    response.cookies.delete(TOKEN_COOKIE_NAME);
    response.cookies.delete(REFRESH_COOKIE_NAME);
    return response;
  }

  // 6. Authorized company user -> Proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .svg, .png)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
