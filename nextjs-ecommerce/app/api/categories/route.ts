import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const { category, billboard, billboardId } = await req.json();

    if (!category || category.length < 2) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const categoryCase = category.toLowerCase();

    const categoryProduct = await db?.category.create({
      data: {
        category: categoryCase,
        billboard,
        billboardId,
      },
    });
    return NextResponse.json({
      msg: "Successful create category",
      categoryProduct,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error creating category" });
  }
}

export async function GET(req: Request) {
  try {
    console.log("📂 Fetching all categories...");
    
    // Check database connection
    if (!db) {
      console.error("❌ Database client not initialized");
      return NextResponse.json(
        { error: "Database connection failed" }, 
        { status: 500 }
      );
    }

    const categories = await db.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`✅ Found ${categories.length} categories`);
    return NextResponse.json(categories, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error("❌ Error getting categories:", error);
    return NextResponse.json(
      { 
        error: "Error getting categories", 
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
