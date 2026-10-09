import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@repo/shared";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? "";

    if (accessToken) {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(() => {});
    }

    const response = NextResponse.json({ success: true, message: "Logged out" });
    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("adminRole", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    console.error("[LOGOUT ERROR]:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
