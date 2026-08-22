
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
 
// 👇 غيّر هاد الاسم إذا اسم الـ cookie تبعك مختلف
const TOKEN_COOKIE_NAME = "accessToken";
 
// الصفحات اللي مفتوحة للكل (بدون تسجيل دخول)
const publicRoutes = ["/", "/auth", "/verify-email", "/forgot-password", "/reset-password"];
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  // 1. هل هاد المسار من الصفحات العامة؟
  const isPublicRoute = publicRoutes.includes(pathname);
 
  // 2. هل المستخدم معه token؟
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  console.log("MIDDLEWARE GET TOKEN" ,request.cookies.getAll());
    
  // 3. إذا الصفحة عامة → خليه يفوت عادي، مهما كان الوضع
  if (isPublicRoute) {
    return NextResponse.next();
  }
 
  // 4. إذا الصفحة محمية وما معه token → رجعو عـ /auth
  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
 
  // 5. معه token والصفحة محمية → خليه يفوت
  return NextResponse.next();
}
 
// حدد وين بدو الـ middleware يشتغل (كل الصفحات ما عدا API، ملفات static، وصور Next)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
 
