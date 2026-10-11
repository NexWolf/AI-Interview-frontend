import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@repo/shared";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    const user = data?.data?.user;
    const role = user?.role;

    // Role check: Only COMPANY, ADMIN, or SUPER_ADMIN can enter the Company portal
    if (role !== "COMPANY" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. A Company recruiter account is required to enter this portal.",
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

    return response;
  } catch (error) {
    console.error("Company Login API route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error occurred while signing in.",
      },
      { status: 500 }
    );
  }
}
