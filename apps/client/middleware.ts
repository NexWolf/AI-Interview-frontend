import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// الصفحات اللي مفتوحة للكل (بدون تسجيل دخول)
const publicRoutes = ["/", "/auth", "/verify-email", "/forgot-password", "/reset-password"];

// المسارات التي تتطلب إكمال البروفايل (onboarding)
const onboardingRequiredRoutes = ["/dashboard", "/interview", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // استثناء غرف المقابلات المباشرة (مثل /interview/153 أو روابط الدعوة)
  const isInterviewSession =
    (pathname.startsWith("/interview/") && pathname !== "/interview/setup") ||
    request.nextUrl.searchParams.has("token");

  if (isInterviewSession) {
    return NextResponse.next();
  }

  // 1. هل هاد المسار من الصفحات العامة؟
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // 2. هل المستخدم معه accessToken أو refreshToken؟
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);
  const isOnboardingDone = request.cookies.get("onboardingDone")?.value === "true";

  // 3. إذا مسجل دخول وراح على صفحة الدخول → وجّهه للـ dashboard أو onboarding
  if (isAuthenticated && (pathname === "/auth" || pathname.startsWith("/auth/"))) {
    return NextResponse.redirect(
      new URL(isOnboardingDone ? "/dashboard" : "/onboarding", request.url),
    );
  }

  // 4. إذا مسار محمي وما معه أي توكن → رجعو عـ /auth
  if (!isPublicRoute && !isAuthenticated) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 5. إذا مسجل بس ما خلص onboarding وطالب يفتح مسار يحتاجه → وجّهه للـ onboarding
  if (
    isAuthenticated &&
    !isOnboardingDone &&
    onboardingRequiredRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 6. مسجل دخول وصفحة محمية → اسمح له بالمرور
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|m4a|mp3|wav|ogg)$).*)",
  ],
};