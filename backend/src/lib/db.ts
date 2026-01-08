import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

declare global {
  var prisma: PrismaClient | undefined;
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  console.error("❌ DATABASE_URL is not set in environment variables");
  console.error("Please set DATABASE_URL in your .env file");
}

const prismaClientSingleton = () => {
  let databaseUrl = process.env.DATABASE_URL || "";
  
  // Validate DATABASE_URL
  if (!databaseUrl || databaseUrl.trim() === "") {
    throw new Error("DATABASE_URL is required but not set. Please set it in your .env file.");
  }
  
  // If using Transaction pooler (port 6543), ensure pgbouncer=true is in URL
  // Transaction pooler does NOT support prepared statements
  if (databaseUrl.includes("pooler.supabase.com") && databaseUrl.includes(":6543")) {
    // Transaction pooler - add pgbouncer=true if not present
    if (!databaseUrl.includes("pgbouncer=true")) {
      databaseUrl += (databaseUrl.includes("?") ? "&" : "?") + "pgbouncer=true";
    }
    // Ensure connection_limit is set
    if (!databaseUrl.includes("connection_limit")) {
      databaseUrl += "&connection_limit=1";
    }
    console.log("🔧 Using Transaction pooler - prepared statements disabled");
  } else if (databaseUrl.includes("pooler.supabase.com") && databaseUrl.includes(":5432")) {
    // Session pooler - supports prepared statements, but may need pgbouncer=true
    if (!databaseUrl.includes("pgbouncer=true") && databaseUrl.includes("pooler")) {
      // Session pooler doesn't need pgbouncer=true, but we'll add it if it's a pooler URL
      console.log("🔧 Using Session pooler - prepared statements enabled");
    }
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
};

export const db = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Test connection on startup
if (process.env.NODE_ENV !== "production") {
  db.$connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((error) => console.error("❌ Database connection failed:", error.message));
}
