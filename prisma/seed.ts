import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Yolanda Database in Neon (schema: yolanda)...");

  // 1. Seed Bank Settings
  await prisma.bankSetting.upsert({
    where: { id: "primary" },
    update: {
      telebirrPhone: "+251 911 234 567",
      telebirrName: "Yolanda Beauty Equipment Ltd",
      cbeAccount: "1000 4829 1948 2",
      cbeName: "Yolanda Beauty Equipment Import PLC",
      cbeBranch: "Finfine Main Branch, Addis Ababa",
    },
    create: {
      id: "primary",
      telebirrPhone: "+251 911 234 567",
      telebirrName: "Yolanda Beauty Equipment Ltd",
      cbeAccount: "1000 4829 1948 2",
      cbeName: "Yolanda Beauty Equipment Import PLC",
      cbeBranch: "Finfine Main Branch, Addis Ababa",
    },
  });

  // 2. Seed Categories
  const categoriesData = [
    {
      name: "Hair Salon Equipment",
      slug: "hair-salon",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
      itemCount: 18,
    },
    {
      name: "Facial & Spa Machines",
      slug: "facial-spa",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
      itemCount: 14,
    },
    {
      name: "Makeup & Vanity Stations",
      slug: "makeup-vanity",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      itemCount: 12,
    },
    {
      name: "Nail & Pedicure Thrones",
      slug: "nail-pedicure",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
      itemCount: 9,
    },
    {
      name: "Sterilizers & Towel Warmers",
      slug: "sterilizers",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      itemCount: 8,
    },
  ];

  const catMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap.set(cat.name, created.id);
  }

  // 4. Seed Beauty Salon Equipment Products
  const productsData = [
    {
      name: "Pro Hydra-Facial Dermabrasion 9-in-1",
      categoryName: "Facial & Spa Machines",
      subtitle: "Deep pore infusion & skin rejuvenation",
      price: 48500,
      originalPrice: 56000,
      rating: 4.9,
      reviewsCount: 38,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      inStock: true,
      isNewArrival: true,
      isBestSeller: true,
      voltage: "220V - 50Hz (Ethiopian Standard)",
      power: "350W Medical Pump",
      warranty: "2-Year Salon Warranty",
      dimensions: "45 x 38 x 92 cm",
      grade: "Commercial Spa Grade",
      description: "The gold standard for modern Ethiopian beauty clinics and luxury spas. Features vacuum hydra-peeling, cold hammer, RF contouring, oxygen spray gun, and ultrasonic scrubbers in one heavy-duty chassis.",
    },
    {
      name: "Ozone Salon Hooded Hair Steamer & Dryer",
      categoryName: "Hair Salon Equipment",
      subtitle: "Deep oil conditioning & rapid color processing",
      price: 18900,
      originalPrice: 22500,
      rating: 4.8,
      reviewsCount: 64,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      inStock: true,
      isBestSeller: true,
      voltage: "220V Salon Voltage",
      power: "650W High Output",
      warranty: "1-Year Commercial Warranty",
      dimensions: "Height Adjustable 110-150cm",
      grade: "Heavy Duty Metal Stand",
      description: "Essential for every women's hair salon. Delivers micro-mist ozone steam to accelerate hair mask absorption and hair dye development by up to 50% compared to conventional dryers.",
    },
    {
      name: "Luxury Reclining Hydraulic Salon Styling Chair",
      categoryName: "Hair Salon Equipment",
      subtitle: "Heavy duty cast base & memory foam padding",
      price: 24500,
      originalPrice: 28900,
      rating: 4.9,
      reviewsCount: 42,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      inStock: true,
      voltage: "Manual Hydraulic Foot Pump",
      power: "Zero Electricity Needed",
      warranty: "3-Year Hydraulic Pump Warranty",
      dimensions: "Seat Width: 52cm, Height: 85-102cm",
      grade: "300kg Load Bearing",
      description: "Multi-purpose styling chair ideal for hair cuts, hair treatments, facial threading, and makeup artistry. Equipped with an ultra-quiet hydraulic lift and durable stainless steel base.",
    },
    {
      name: "Dimmable LED Hollywood Vanity Station Mirror",
      categoryName: "Makeup & Vanity Stations",
      subtitle: "3 color temperatures with USB & power outlets",
      price: 15800,
      originalPrice: 19500,
      rating: 4.8,
      reviewsCount: 51,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      inStock: true,
      voltage: "100-240V Multi-voltage",
      power: "15 Replaceable Frosted LED Bulbs",
      warranty: "1-Year Warranty",
      dimensions: "80 x 65 cm Large Frame",
      grade: "Shatterproof HD Glass",
      description: "The makeup artist’s centerpiece. Flawless shadow-free illumination guarantees bridal and photoshoot makeup looks true to color in any lighting condition.",
    },
    {
      name: "UV Sanitizing Hot Towel Warmer Cabinet 16L",
      categoryName: "Sterilizers & Towel Warmers",
      subtitle: "Maintains 70°C with dual UV germicidal lamps",
      price: 11400,
      originalPrice: 13900,
      rating: 4.7,
      reviewsCount: 29,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      inStock: true,
      voltage: "220V Salon Voltage",
      power: "200W Energy Saver",
      warranty: "1-Year Warranty",
      dimensions: "45 x 28 x 35 cm (Holds 24-30 Towels)",
      grade: "Commercial Spa Grade",
      description: "Give your salon clients the 5-star spa treatment with comforting, hygienic warm facial and body towels ready at all times. Essential for facials, shaves, and shampoo services.",
    },
    {
      name: "Professional 18-inch Bi-Color Salon Ring Light",
      categoryName: "Makeup & Vanity Stations",
      subtitle: "With heavy-duty tripod & dual phone holders",
      price: 8900,
      originalPrice: 11200,
      rating: 4.9,
      reviewsCount: 88,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      inStock: true,
      voltage: "Multi-voltage 100-240V",
      power: "65W High Lumen Output",
      warranty: "1-Year Warranty",
      dimensions: "Extendable 2-meter steel stand",
      grade: "Studio Grade",
      description: "Designed for content-creating beauty salons and makeup studios. Shows client hairstyles and makeup transformations in crisp, high-definition natural glow.",
    },
  ];

  for (const prod of productsData) {
    const categoryId = catMap.get(prod.categoryName);
    if (!categoryId) continue;

    const { categoryName, ...rest } = prod;
    await prisma.product.create({
      data: {
        ...rest,
        categoryId,
      },
    });
  }

  console.log("Seeding to Neon completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
