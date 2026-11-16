import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Map DB products to frontend Product interface
function formatProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    category: p.category?.name || "Equipment",
    categoryId: p.categoryId,
    subtitle: p.subtitle || "",
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    rating: p.rating || 5.0,
    reviewsCount: p.reviewsCount || 0,
    image: p.image,
    inStock: p.inStock,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    specs: {
      voltage: p.voltage?.trim() || undefined,
      power: p.power?.trim() || undefined,
      warranty: p.warranty?.trim() || undefined,
      dimensions: p.dimensions?.trim() || undefined,
      grade: p.grade?.trim() || undefined,
    },
    warranty: p.warranty?.trim() || undefined,
    description: p.description || "",
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};

    if (category && category !== "All") {
      where.category = {
        name: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [dbProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    // Map DB products to frontend Product interface
    const mappedProducts = dbProducts.map(formatProduct);

    return NextResponse.json({
      success: true,
      products: mappedProducts,
      categories,
    });
  } catch (error: any) {
    console.error("Products API GET error:", error);
    return NextResponse.json(
      { error: "Failed to load equipment catalog." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      subtitle,
      categoryId,
      price,
      originalPrice,
      rating = 5.0,
      image,
      inStock = true,
      isNewArrival = false,
      isBestSeller = false,
      warranty = "1 Year Official Warranty",
      voltage,
      power,
      dimensions,
      grade = "Commercial Salon Grade",
      description,
    } = body;

    // Graceful fallbacks for optional/unfilled fields
    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      const firstCat = await prisma.category.findFirst({ select: { id: true } });
      targetCategoryId = firstCat?.id || "";
    }

    const defaultImg = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";

    const newProduct = await prisma.product.create({
      data: {
        name: name?.trim() || "Salon Product",
        subtitle: subtitle?.trim() || "",
        categoryId: targetCategoryId,
        price: price !== undefined && !isNaN(Number(price)) ? Number(price) : 0,
        originalPrice: originalPrice && !isNaN(Number(originalPrice)) ? Number(originalPrice) : null,
        rating: rating !== undefined && !isNaN(Number(rating)) ? Math.min(5, Math.max(1, Number(rating))) : 5.0,
        image: image?.trim() || defaultImg,
        inStock: Boolean(inStock),
        isNewArrival: Boolean(isNewArrival),
        isBestSeller: Boolean(isBestSeller),
        warranty: warranty?.trim() || "1 Year Official Warranty",
        voltage: voltage?.trim() || null,
        power: power?.trim() || null,
        dimensions: dimensions?.trim() || null,
        grade: grade?.trim() || null,
        description: description?.trim() || "",
      },
      include: {
        category: true,
      },
    });

    // Update category item count
    try {
      const count = await prisma.product.count({ where: { categoryId } });
      await prisma.category.update({
        where: { id: categoryId },
        data: { itemCount: count },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      product: formatProduct(newProduct),
    });
  } catch (error: any) {
    console.error("Products API POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create product." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const payload: any = {};
    if (updateData.name !== undefined) payload.name = updateData.name.trim() || "Salon Product";
    if (updateData.subtitle !== undefined) payload.subtitle = updateData.subtitle?.trim() || "";
    if (updateData.categoryId !== undefined && updateData.categoryId) payload.categoryId = updateData.categoryId;
    if (updateData.price !== undefined) payload.price = isNaN(Number(updateData.price)) ? 0 : Number(updateData.price);
    if (updateData.originalPrice !== undefined) {
      payload.originalPrice = updateData.originalPrice && !isNaN(Number(updateData.originalPrice)) ? Number(updateData.originalPrice) : null;
    }
    if (updateData.rating !== undefined) {
      payload.rating = isNaN(Number(updateData.rating)) ? 5.0 : Math.min(5, Math.max(1, Number(updateData.rating)));
    }
    if (updateData.image !== undefined) payload.image = updateData.image.trim() || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";
    if (updateData.inStock !== undefined) payload.inStock = Boolean(updateData.inStock);
    if (updateData.isNewArrival !== undefined) payload.isNewArrival = Boolean(updateData.isNewArrival);
    if (updateData.isBestSeller !== undefined) payload.isBestSeller = Boolean(updateData.isBestSeller);
    if (updateData.warranty !== undefined) payload.warranty = updateData.warranty?.trim() || "1 Year Official Warranty";
    if (updateData.voltage !== undefined) payload.voltage = updateData.voltage?.trim() || null;
    if (updateData.power !== undefined) payload.power = updateData.power?.trim() || null;
    if (updateData.dimensions !== undefined) payload.dimensions = updateData.dimensions?.trim() || null;
    if (updateData.grade !== undefined) payload.grade = updateData.grade?.trim() || null;
    if (updateData.description !== undefined) payload.description = updateData.description.trim() || "";

    const updated = await prisma.product.update({
      where: { id },
      data: payload,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: formatProduct(updated),
    });
  } catch (error: any) {
    console.error("Products API PUT error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const categoryId = product.categoryId;

    // Delete related order items if necessary or disconnect
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    // Update category count
    if (categoryId) {
      try {
        const count = await prisma.product.count({ where: { categoryId } });
        await prisma.category.update({
          where: { id: categoryId },
          data: { itemCount: count },
        });
      } catch {}
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error: any) {
    console.error("Products API DELETE error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
