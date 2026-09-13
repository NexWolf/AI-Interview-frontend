import { API_URL } from "@/constants/routes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? "";

    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("onboardingDone", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    console.error("LOGOUT PROXY ERROR:", error);
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 });
  }
}