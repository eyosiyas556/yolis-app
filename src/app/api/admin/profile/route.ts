import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { error: "Admin email or ID is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(email ? [{ email: email.toLowerCase() }] : []),
        ],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Admin Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve admin profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, email, fullName, phone, avatar, currentPassword, newPassword } = body;

    if (!id && !email) {
      return NextResponse.json(
        { error: "User identifier (id or email) is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(email ? [{ email: email.toLowerCase() }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    const updateData: any = {};

    if (fullName && fullName.trim()) {
      updateData.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar?.trim() || null;
    }

    if (email && email.trim() && email.toLowerCase() !== user.email.toLowerCase()) {
      // Check if new email already taken
      const existing = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: "This email address is already in use by another account." },
          { status: 400 }
        );
      }
      updateData.email = email.trim().toLowerCase();
    }

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Admin Profile PUT error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update admin profile." },
      { status: 500 }
    );
  }
}
