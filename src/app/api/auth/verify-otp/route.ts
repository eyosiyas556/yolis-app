import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    const cleanOtp = otp?.trim();

    if (!cleanEmail || !cleanOtp) {
      return NextResponse.json(
        { error: "Email and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return NextResponse.json(
        { error: "No active verification code request found. Please request a new code." },
        { status: 400 }
      );
    }

    // Check expiry (1.5 minutes)
    if (new Date() > new Date(user.resetOtpExpiry)) {
      return NextResponse.json(
        { error: "The verification code has expired (1.5 min limit). Please request a new code." },
        { status: 400 }
      );
    }

    // Check code match
    if (user.resetOtp !== cleanOtp) {
      return NextResponse.json(
        { error: "Incorrect verification code. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code verified successfully.",
    });
  } catch (error: any) {
    console.error("Verify OTP API error:", error);
    return NextResponse.json(
      { error: "Server error occurred while verifying code." },
      { status: 500 }
    );
  }
}
