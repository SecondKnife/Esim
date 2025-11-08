import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const body = await req.json();

    const {
      title,
      description,
      price,
      imageURLs,
      featured,
      category,
      sizes,
      categoryId,
      discount,
      // eSIM/SIM specific fields
      country,
      region,
      dataPlan,
      validityDays,
      simType,
    } = body;

    if (
      !title ||
      title.length < 4 ||
      !description ||
      description.length < 4 ||
      !price ||
      !imageURLs ||
      !Array.isArray(imageURLs) ||
      imageURLs.length === 0 ||
      !category
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    let priceDiscount: number = 0;
    if (discount > 0) {
      const mathDiscount = (discount / 100) * +price;
      priceDiscount = +price - mathDiscount;
    }

    const product = await db?.product.create({
      data: {
        title,
        description,
        price,
        featured,
        imageURLs: JSON.stringify(imageURLs),
        category,
        categoryId,
        discount,
        finalPrice: priceDiscount,
        // eSIM/SIM specific fields
        country: country || null,
        region: region || null,
        dataPlan: dataPlan || null,
        validityDays: validityDays || null,
        simType: simType || null,
        productSizes: {
          create: (sizes || []).map((size: any) => ({
            size: { connect: { id: size.id } },
            name: size.name,
          })),
        },
      },
    });
    return NextResponse.json({ msg: "Successful create product", product });
  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" });
  }
}

export async function GET(req: Request) {
  try {
    console.log("📦 Fetching all products...");
    
    // Check database connection
    if (!db) {
      console.error("❌ Database client not initialized");
      return NextResponse.json(
        { error: "Database connection failed" }, 
        { status: 500 }
      );
    }

    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`✅ Found ${products.length} products`);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("❌ Error getting products:", error);
    return NextResponse.json(
      { 
        error: "Error getting products", 
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
