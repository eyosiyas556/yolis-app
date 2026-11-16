import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.bankSetting.findUnique({
      where: { id: "primary" },
    });

    return NextResponse.json({
      success: true,
      settings: settings || {
        telebirrPhone: "+251 911 234 567",
        telebirrName: "Yolanda Beauty Equipment Ltd",
        cbeAccount: "1000 4829 1948 2",
        cbeName: "Yolanda Beauty Equipment Import PLC",
        cbeBranch: "Finfine Main Branch, Addis Ababa",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bank settings." },
      { status: 500 }
    );
  }
}
