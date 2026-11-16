import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      salonName,
      contactPerson,
      phone,
      address,
      city,
      items,
      totalAmount,
      paymentMethod,
      transactionNumber,
      receiptImageUrl,
      userEmail,
    } = body;

    if (!salonName || !contactPerson || !phone || !address) {
      return NextResponse.json(
        { error: "Please fill in all salon contact details." },
        { status: 400 }
      );
    }

    const orderNumber = `SLN-${Math.floor(1000 + Math.random() * 9000)}`;

    // Connect to user if email provided
    let userId: string | undefined = undefined;
    if (userEmail) {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (user) userId = user.id;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        salonName,
        contactPerson,
        phone,
        address,
        city: city || "Addis Ababa",
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: paymentMethod || "Direct Wholesale Order",
        transactionNumber: transactionNumber || `REQ-${orderNumber}`,
        receiptImageUrl: receiptImageUrl || null,
        status: "NEW_ORDER",
        items: {
          create: (items || []).map((item: any) => ({
            productId: item.productId || item.product?.id,
            quantity: item.quantity || 1,
            price: Number(item.price || item.product?.price || 0),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { error: "Failed to place order in database." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const isAll = searchParams.get("all") === "true" || searchParams.get("admin") === "true";

    let whereClause: any = {};

    if (!isAll) {
      // Customer view: strictly isolate to the specific customer's account
      if (!email && !phone) {
        return NextResponse.json({ success: true, orders: [] });
      }

      const orConditions: any[] = [];

      // 1. Match by user ID linked to account email
      if (email) {
        const cleanEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (user) {
          orConditions.push({ userId: user.id });
        }
      }

      // 2. Match by exact phone digits (e.g. last 9 core digits)
      if (phone) {
        const digits = phone.replace(/\D/g, "");
        const core9 = digits.slice(-9);
        if (core9 && core9.length >= 9) {
          orConditions.push({ phone: { contains: core9 } });
        }
      }

      if (orConditions.length === 0) {
        return NextResponse.json({ success: true, orders: [] });
      }

      whereClause = { OR: orConditions };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order ID and new status are required." },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        rejectionReason: rejectionReason || null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  return PUT(req);
}

