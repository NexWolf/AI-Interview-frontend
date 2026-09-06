import { API_URL } from "@/constants/routes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: "No refresh token provided (لم يتم توفير رمز التحديث)" }, 
                { status: 401 }
            );
        }

        const backendResponse = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!backendResponse.ok) {
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            return NextResponse.json(
                { success: false, message: "Refresh Failed (فشل تحديث الرمز)" }, 
                { status: 401 }
            );
        }

        let newAccessToken: string | null = null;
        
        // تجهيز الـ Response النهائي
        const response = NextResponse.json({
            success: true,
            accessToken: newAccessToken
        });

        const setCookies = backendResponse.headers.getSetCookie();

        for (const cookie of setCookies) {
            const [cookiePair] = cookie.split(";");
            const separatorIndex = cookiePair.indexOf("=");
            const name = cookiePair.slice(0, separatorIndex).trim();
            const value = cookiePair.slice(separatorIndex + 1).trim();

            if (name === "accessToken") {
                newAccessToken = value;
                response.cookies.set({
                    name: "accessToken",
                    value,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 15,
                });
            }

            if (name === "refreshToken") {
                response.cookies.set({
                    name: "refreshToken",
                    value,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                });
            }
        }

        return response;

    } catch (error) {
        console.error("REFRESH PROXY ERROR: ", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong (حدث خطأ ما)" },
            { status: 500 }
        );
    }
}


// import { API_URL } from "@/constants/routes";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST() {
//     try {
//         const cookieStore = await cookies();
//         const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

//         if (!refreshToken) {
//             return NextResponse.json(
//                 { success: false, message: "No refresh token provided" }, { status: 401 })
//         }

//         const backendResponse = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
//             method: "POST",
//             headers: { "Content-type": "application/json" },
//             body: JSON.stringify({ refreshToken }),
//         })

//         if (!backendResponse.ok) {
//             cookieStore.delete("accessToken");
//             cookieStore.delete("refreshToken");
//             return NextResponse.json(
//                 { success: false, message: "Refresh Failed" }, { status: 401 }
//             )
//         }

//         let newAccessToken: string | null = null;
//         const response = NextResponse.json({
//             success: true,
//         })

//         const setCookies = backendResponse.headers.getSetCookie();

//         for (const cookie of setCookies) {
//             const [cookiePair] = cookie.split(";");
//             const seperatorIndex = cookiePair.indexOf("=");
//             const name = cookiePair.slice(0, seperatorIndex);
//             const value = cookiePair.slice(seperatorIndex + 1);

//             if (name === "accessToken") {
//                 newAccessToken = value;

//                 response.cookies.set({
//                     name: "accessToken",
//                     value,
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === "production",
//                     sameSite: "lax",
//                     path: "/",
//                     maxAge: 60 * 15,
//                 })
//             }

//             if (name === "refreshToken") {
//                 response.cookies.set({
//                     name: "refreshToken",
//                     value,
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === "production",
//                     sameSite: "lax",
//                     path: "/",
//                     maxAge: 60 * 60 * 24 * 7,
//                 })
//             }
//         }

//         return NextResponse.json(
//             { success: true, accessToken: newAccessToken },
//             { headers: response.headers }
//         );


//     } catch (error) {
//         console.error("REFRESH PROXY ERROR: ", error)
//         return NextResponse.json(
//             { success: false, message: "Something went wrong" },
//             { status: 500 },
//         )
//     }
// }