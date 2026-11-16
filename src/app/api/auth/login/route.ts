import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

function getPhoneVariations(input: string): string[] {
  const variations = new Set<string>();
  const trimmed = input.trim();
  variations.add(trimmed);

  // Extract pure digits
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
    const { identifier, password } = await req.json();

    const cleanIdentifier = identifier?.trim();

    if (!cleanIdentifier || !password) {
      return NextResponse.json(
        { error: "Please enter your Phone number or Email, and your password." },
        { status: 400 }
      );
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
