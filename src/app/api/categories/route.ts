import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const mapped = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      itemCount: c._count.products,
    }));

    return NextResponse.json({ success: true, categories: mapped });
  } catch (error: any) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { error: "Failed to load categories." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, image } = body;

    const catName = name?.trim() || "New Department";
    const catImage = image?.trim() || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";
    const generatedSlug = slug?.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newCategory = await prisma.category.create({
      data: {
        name: catName,
        slug: generatedSlug,
        image: catImage,
        itemCount: 0,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create category." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, slug, image } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    const payload: any = {};
    if (name) payload.name = name.trim();
    if (slug) payload.slug = slug.trim();
    if (image) payload.image = image.trim();

    const updated = await prisma.category.update({
      where: { id },
      data: payload,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("Categories PUT error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It currently has ${productCount} active product(s). Please reassign or delete them first.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted successfully." });
  } catch (error: any) {
    console.error("Categories DELETE error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete category." },
      { status: 500 }
    );
  }
}
