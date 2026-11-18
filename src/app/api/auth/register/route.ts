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

function normalizeEthiopianPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("2519") && digits.length === 12) {
    return "+" + digits;
  }
  if (digits.startsWith("09") && digits.length === 10) {
    return "+251" + digits.slice(1);
  }
  if (digits.startsWith("9") && digits.length === 9) {
    return "+251" + digits;
  }
  return input.trim();
}

function getPhoneVariations(input: string): string[] {
  const variations = new Set<string>();
  const trimmed = input.trim();
  variations.add(trimmed);
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
    const { fullName, phone, email, password } = await req.json();

    const cleanName = fullName?.trim();
    const cleanPhone = phone?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName || !cleanPhone || !cleanEmail || !password) {
      return NextResponse.json(
        { error: "Full Name, Phone number, Email, and Password are all required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address (e.g. name@example.com)." },
        { status: 400 }
      );
    }

    if (!isValidEthiopianPhone(cleanPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid 9-digit Ethiopian mobile number starting with 9 (e.g. 911 234 567)." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeEthiopianPhone(cleanPhone);

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const phoneVariations = getPhoneVariations(normalizedPhone);

    // Check existing by email or phone
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...phoneVariations.map((p) => ({ phone: p })),
        ],
      },
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this phone number already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: cleanName,
        phone: normalizedPhone,
        email: cleanEmail,
        passwordHash,
        role: "CUSTOMER",
      },
    });

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
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Server error occurred during registration." },
      { status: 500 }
    );
  }
}
