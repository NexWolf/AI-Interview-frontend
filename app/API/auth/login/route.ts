import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Send login request to backend
    const backendResponse = await fetch(
      "https://nexwolf-api.up.railway.app/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
        const data = await backendResponse.json();


    console.log("BACKEND STATUS:", backendResponse.status);
console.log("BACKEND DATA:", data);


    // 2. If backend login failed
    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    // 3. Create Next.js response
    const response = NextResponse.json(data);

    // 4. Get cookies from backend
    const setCookies = backendResponse.headers.getSetCookie();

    // 5. Put cookies on localhost
    for (const cookie of setCookies) {
      const [cookiePair] = cookie.split(";");

      const separatorIndex = cookiePair.indexOf("=");

      const name = cookiePair.slice(0, separatorIndex);
      const value = cookiePair.slice(separatorIndex + 1);

      if (name === "accessToken") {
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
    console.error("LOGIN PROXY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}