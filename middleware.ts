import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const TOKEN_COOKIE_NAME = "accessToken";

// الصفحات اللي مفتوحة للكل (بدون تسجيل دخول)
const publicRoutes = ["/", "/auth", "/verify-email", "/forgot-password", "/reset-password", "/guest-interview"];

// المسارات التي تتطلب إكمال البروفايل (onboarding)
const onboardingRequiredRoutes = ["/dashboard", "/interview", "/admin", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. هل هاد المسار من الصفحات العامة؟
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // 2. هل المستخدم معه token؟
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const isOnboardingDone = request.cookies.get("onboardingDone")?.value === "true";

  // 3. إذا عليه token وراح على صفحة الدخول → وجّهه بعده
  if (token && (pathname === "/auth" || pathname.startsWith("/auth/"))) {
    return NextResponse.redirect(
      new URL(isOnboardingDone ? "/dashboard" : "/onboarding", request.url),
    );
  }

  // 4. إذا مسار محمي وما معه token → رجعو عـ /auth
  if (!isPublicRoute && !token) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 5. إذا معه token بس ما خلص onboarding وطالب يفتح مسار يحتاجه → وجّهه للـ onboarding
  if (
    token &&
    !isOnboardingDone &&
    onboardingRequiredRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 6. معه token وصفحة محمية → خليه يفوت
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|m4a)$).*)",
  ],
};
