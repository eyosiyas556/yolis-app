import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    const cleanOtp = otp?.trim();

    if (!cleanEmail || !cleanOtp || !newPassword) {
      return NextResponse.json(
        { error: "Email, 6-digit code, and new password are all required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return NextResponse.json(
        { error: "No active password reset request found for this email." },
        { status: 400 }
      );
    }

    // Verify expiry
    if (new Date() > new Date(user.resetOtpExpiry)) {
      return NextResponse.json(
        { error: "The verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP match
    if (user.resetOtp !== cleanOtp) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check your code and try again." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetOtp: null,
        resetOtpExpiry: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You can now sign in with your Name and New Password.",
      user: updated,
    });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "Server error occurred while resetting your password." },
      { status: 500 }
    );
  }
}
