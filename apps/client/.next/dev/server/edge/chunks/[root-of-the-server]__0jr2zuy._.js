(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__0jr2zuy._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/apps/client/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
const TOKEN_COOKIE_NAME = "accessToken";
// الصفحات اللي مفتوحة للكل (بدون تسجيل دخول)
const publicRoutes = [
    "/",
    "/auth",
    "/verify-email",
    "/forgot-password",
    "/reset-password"
];
// المسارات التي تتطلب إكمال البروفايل (onboarding)
const onboardingRequiredRoutes = [
    "/dashboard",
    "/interview",
    "/admin",
    "/profile"
];
function middleware(request) {
    const { pathname } = request.nextUrl;
    // 1. هل هاد المسار من الصفحات العامة؟
    const isPublicRoute = publicRoutes.some((route)=>pathname === route || pathname.startsWith(`${route}/`));
    // 2. هل المستخدم معه token؟
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
    const isOnboardingDone = request.cookies.get("onboardingDone")?.value === "true";
    // 3. إذا عليه token وراح على صفحة الدخول → وجّهه بعده
    if (token && (pathname === "/auth" || pathname.startsWith("/auth/"))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(isOnboardingDone ? "/dashboard" : "/onboarding", request.url));
    }
    // 4. إذا مسار محمي وما معه token → رجعو عـ /auth
    if (!isPublicRoute && !token) {
        const url = new URL("/auth", request.url);
        url.searchParams.set("next", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    // 5. إذا معه token بس ما خلص onboarding وطالب يفتح مسار يحتاجه → وجّهه للـ onboarding
    if (token && !isOnboardingDone && onboardingRequiredRoutes.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/onboarding", request.url));
    }
    // 6. معه token وصفحة محمية → خليه يفوت
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|m4a|mp3|wav|ogg)$).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0jr2zuy._.js.map