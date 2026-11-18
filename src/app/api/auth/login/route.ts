import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEthiopianPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("251")) {
    return /^2519\d{8}$/.test(digits);
  }
  if (digits.startsWith("0")) {
    return /^09\d{8}$/.test(digits);
  }
  return /^9\d{8}$/.test(digits);
}

function getPhoneVariations(input: string): string[] {
  const variations = new Set<string>();
  const trimmed = input.trim();
  variations.add(trimmed);

  // Extract pure digits
  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("2519") && digits.length === 12) {
    variations.add("+" + digits);
    variations.add(digits);
    variations.add("0" + digits.slice(3));
    variations.add(digits.slice(3));
  } else if (digits.startsWith("09") && digits.length === 10) {
    variations.add("+251" + digits.slice(1));
    variations.add("251" + digits.slice(1));
    variations.add(digits);
    variations.add(digits.slice(1));
  } else if (digits.startsWith("9") && digits.length === 9) {
    variations.add("+251" + digits);
    variations.add("251" + digits);
    variations.add("0" + digits);
    variations.add(digits);
  }

  return Array.from(variations);
}

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    const cleanIdentifier = identifier?.trim();

    if (!cleanIdentifier || !password) {
      return NextResponse.json(
        { error: "Please enter your Phone number or Email, and your password." },
        { status: 400 }
      );
    }

    const isEmailInput = cleanIdentifier.includes("@") || /[a-zA-Z]/.test(cleanIdentifier);
    if (isEmailInput) {
      if (!EMAIL_REGEX.test(cleanIdentifier)) {
        return NextResponse.json(
          { error: "Please enter a valid email address (e.g. name@example.com)." },
          { status: 400 }
        );
      }
    } else {
      if (!isValidEthiopianPhone(cleanIdentifier)) {
        return NextResponse.json(
          { error: "Please enter a valid Ethiopian phone number starting with 9 (e.g. 0911 234 567 or 911 234 567)." },
          { status: 400 }
        );
      }
    }

    const phoneVariations = getPhoneVariations(cleanIdentifier);
    const orConditions: any[] = [
      { email: cleanIdentifier.toLowerCase() },
      ...phoneVariations.map((p) => ({ phone: p })),
    ];

    // Customer logs in with their Phone number (09..., +251...) OR Email address
    const user = await prisma.user.findFirst({
      where: {
        OR: orConditions,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please enter your valid Phone or Email and Password." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials. Please enter your valid Phone or Email and Password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Invalid credentials. Please enter your valid Phone or Email and Password." },
      { status: 401 }
    );
  }
}
