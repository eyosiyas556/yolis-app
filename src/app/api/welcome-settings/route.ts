import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_WELCOME_SETTINGS = {
  id: "primary",
  brandLogoImage: "/yolanda-logo.jpg",
  brandName: "Yolanda Salon Equipment",
  brandSubtitle: "Salon & Makeup Equipment",
  heroBadge: "Wholesale Equipment",
  heroTitleLine1: "Equipping Top Salons,",
  heroTitleLine2: "Across Ethiopia.",
  heroSubtitle: "Direct importer of commercial equipment for beauty salons & makeup studios.",
  heroMotto: "Commercial Equipment ✦ For Beauty & Makeup Salons",
  heroBgImage: "/hero-bg.jpg",
  mobileHeroBgImage: "/mobile-welcome-hero.jpg",
  pillarSectionTag: "Built For Ethiopian Salons",
  pillarSectionTitle: "Why Top Salons Trust Yolanda",
  pillarSectionSubtitle: "Directly imported commercial-grade equipment built for heavy daily salon use.",
  pillar1Title: "220V Commercial Ready",
  pillar1Desc: "Every steamer, hydra-facial machine, and styling chair is pre-calibrated for Ethiopian electrical standards with heavy-duty surge protection.",
  pillar1Badge: "Tested for 220V/50Hz",
  pillar2Title: "1-Year Warranty & Parts",
  pillar2Desc: "We provide original replacement parts, certified technician inspection, and on-site warranty service in Addis Ababa so your salon never suffers downtime.",
  pillar2Badge: "Local Technician Support",
  pillar3Title: "Direct Salon Importer",
  pillar3Desc: "Authentic, heavy-duty salon and makeup studio machines directly from certified manufacturers without middleman markups.",
  pillar3Badge: "Verified Salon Quality",
  howItWorksTitle: "How It Works",
  step1Title: "Create Your Account",
  step1Desc: "Register as a salon owner or beauty professional.",
  step2Title: "Explore Equipment in ETB",
  step2Desc: "Unlock wholesale pricing and detailed machine specs.",
  step3Title: "Submit Salon Order",
  step3Desc: "Submit your equipment request in seconds with your contact information.",
  contactPhone: "+251 911 234 567",
  contactTelegram: "https://t.me/yolandabeauty",
  contactLocation: "Bole Medhanialem, Addis Ababa, Ethiopia",
  contactHours: "Mon - Sat: 8:30 AM - 7:30 PM",
  contactEmail: "contact@yolandabeauty.com",
  footerDescription: "Ethiopia's trusted direct importer of commercial equipment for women's beauty salons, hair studios, and makeup salons with 220V certification, genuine parts, and Addis Ababa warranty support.",
  socialInstagram: "https://instagram.com/yolandabeauty",
  socialTiktok: "https://tiktok.com/@yolandabeauty",
  socialFacebook: "https://facebook.com/yolandabeauty",
  socialWhatsapp: "https://wa.me/251911234567",
  footerService1: "1-Year Machine Warranty",
  footerService2: "Direct Equipment Importer",
  footerService3: "Fast Order Confirmation",
  footerService4: "Bulk Order Pricing Discounts",
  copyrightText: "© 2026 Yolanda Salon Equipment Importer. All rights reserved.",
};

export async function GET() {
  try {
    let settings = await prisma.welcomeSetting.findUnique({
      where: { id: "primary" },
    });

    if (!settings) {
      settings = await prisma.welcomeSetting.create({
        data: DEFAULT_WELCOME_SETTINGS,
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Failed to fetch welcome settings:", error);
    return NextResponse.json({
      success: true,
      settings: DEFAULT_WELCOME_SETTINGS,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { adminEmail, settings } = body;

    // Security check: Only Yolanda Admin can update settings
    const cleanEmail = (adminEmail || "").toLowerCase().trim();
    if (adminEmail && cleanEmail !== "admin@yolandabeauty.com" && cleanEmail !== "yolandabeauty@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized: Only Yolanda Admin can edit welcome page." },
        { status: 403 }
      );
    }

    const { id, updatedAt, ...updateData } = settings;

    const updated = await prisma.welcomeSetting.upsert({
      where: { id: "primary" },
      create: {
        ...DEFAULT_WELCOME_SETTINGS,
        ...updateData,
        id: "primary",
      },
      update: updateData,
    });

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error) {
    console.error("Failed to update welcome settings:", error);
    return NextResponse.json(
      { error: "Failed to update welcome settings." },
      { status: 500 }
    );
  }
}
