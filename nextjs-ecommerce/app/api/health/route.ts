import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log("🏥 Health check started");
    
    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasJwtSecret = !!process.env.JWT_SECRET;
    
    console.log("🔑 Environment check:", {
      DATABASE_URL: hasDbUrl ? "Set" : "Missing",
      JWT_SECRET: hasJwtSecret ? "Set" : "Missing",
    });

    if (!hasDbUrl) {
      return NextResponse.json({
        status: "unhealthy",
        message: "DATABASE_URL not configured",
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Test database connection
    console.log("🔌 Testing database connection...");
    await db.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");

    // Get counts
    const [userCount, productCount, categoryCount] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.category.count(),
    ]);

    console.log("📊 Database stats:", {
      users: userCount,
      products: productCount,
      categories: categoryCount,
    });

    return NextResponse.json({
      status: "healthy",
      message: "All systems operational",
      database: {
        connected: true,
        users: userCount,
        products: productCount,
        categories: categoryCount,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasJWT: hasJwtSecret,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Health check failed:", error);
    
    return NextResponse.json({
      status: "unhealthy",
      message: "Database connection failed",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

