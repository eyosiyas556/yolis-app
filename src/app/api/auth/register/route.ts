import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

function normalizeEthiopianPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("251") && digits.length === 12) {
    return "+" + digits;
  }
  if ((digits.startsWith("09") || digits.startsWith("07")) && digits.length === 10) {
    return "+251" + digits.slice(1);
  }
  if ((digits.startsWith("9") || digits.startsWith("7")) && digits.length === 9) {
    return "+251" + digits;
  }
  return input.trim();
}

function getPhoneVariations(input: string): string[] {
  const variations = new Set<string>();
  const trimmed = input.trim();
  variations.add(trimmed);
  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("251") && digits.length === 12) {
    variations.add("+" + digits);
    variations.add(digits);
    variations.add("0" + digits.slice(3));
  } else if ((digits.startsWith("09") || digits.startsWith("07")) && digits.length === 10) {
    variations.add("+251" + digits.slice(1));
    variations.add("251" + digits.slice(1));
    variations.add(digits);
  } else if ((digits.startsWith("9") || digits.startsWith("7")) && digits.length === 9) {
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
    const cleanPhone = phone ? normalizeEthiopianPhone(phone) : "";
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName || !cleanPhone || !cleanEmail || !password) {
      return NextResponse.json(
        { error: "Full Name, Phone number, Email, and Password are all required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const phoneVariations = getPhoneVariations(cleanPhone);

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
        phone: cleanPhone,
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
