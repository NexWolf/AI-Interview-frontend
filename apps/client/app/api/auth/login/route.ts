
import { API_URL } from "@/constants/routes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Send login request to backend
    const backendResponse = await fetch(
      `${API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await backendResponse.json().catch(() => ({}));

    // 2. If backend login failed
    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    const isOnboardingDone = Boolean(data?.data?.user?.onboardingDone);
    console.log("THIS IS THE ONBOARDING DONE VALUE :", isOnboardingDone);

    // 3. Create Next.js response
    const response = NextResponse.json(data);

    // 4. Extract tokens directly from response payload (Guaranteed source)
    const accessToken = data?.data?.accessToken;
    const refreshToken = data?.data?.refreshToken;

    if (accessToken) {
      response.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      });
    }

    if (refreshToken) {
      response.cookies.set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // 5. Fallback: Also parse backend cookies if any were returned in headers
    try {
      const setCookies = backendResponse.headers.getSetCookie?.() || [];
      for (const cookie of setCookies) {
        const [cookiePair] = cookie.split(";");
        const separatorIndex = cookiePair.indexOf("=");
        if (separatorIndex === -1) continue;

        const name = cookiePair.slice(0, separatorIndex).trim();
        const value = cookiePair.slice(separatorIndex + 1).trim();

        if (name === "accessToken" && !accessToken) {
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

        if (name === "refreshToken" && !refreshToken) {
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
    } catch (e) {
      console.warn("Could not parse set-cookie headers:", e);
    }

    response.cookies.set({
      name: "onboardingDone",
      value: String(isOnboardingDone),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 24
    })

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