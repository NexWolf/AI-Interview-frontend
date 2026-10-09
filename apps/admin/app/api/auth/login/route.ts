import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@repo/shared";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Send login request to the backend API
    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json().catch(() => ({}));

    // 2. If credentials or backend validation failed
    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    const user = data?.data?.user;
    const role = user?.role;

    // 3. Strict Admin Role Check: Reject non-admin users
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Administrator privileges are required to enter this portal.",
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user,
      },
      message: "Login successful",
    });

    // 4. Store tokens in secure HttpOnly cookies
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

    // Role indicator cookie (readable for quick checks)
    response.cookies.set({
      name: "adminRole",
      value: role,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[ADMIN LOGIN ERROR]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while connecting to authentication service.",
      },
      { status: 500 }
    );
  }
}
