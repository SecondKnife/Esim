import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables");
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
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
