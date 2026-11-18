import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid registered email address (e.g. name@example.com)." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No salon account is registered with this email." },
        { status: 404 }
      );
    }

    // Generate secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 90 * 1000); // 1.5 minutes (90 seconds) expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: otp,
        resetOtpExpiry: expiry,
      },
    });

    // Send real email via Google SMTP (Yolanda Deliveries)
    try {
      await sendPasswordResetEmail({
        to: cleanEmail,
        recipientName: user.fullName,
        otpCode: otp,
      });
    } catch (mailError: any) {
      console.error("Failed to deliver reset email via SMTP:", mailError);
      return NextResponse.json(
        {
          error: "Failed to send reset email. Please check server mail configuration.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}`,
    });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Server error occurred while requesting password reset." },
      { status: 500 }
    );
  }
}
