/**
 * Seed admin users
 * Chạy: npx tsx prisma/seed-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Tạo admin users...\n");

  // Tạo Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@esim.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@esim.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created!");
  console.log("   📧 Email: admin@esim.com");
  console.log("   🔑 Password: admin123");
  console.log("   👤 Role: ADMIN\n");

  // Tạo Moderator user
  const moderatorPassword = await bcrypt.hash("mod123", 10);
  const moderator = await prisma.user.upsert({
    where: { email: "moderator@esim.com" },
    update: {},
    create: {
      name: "Moderator User",
      email: "moderator@esim.com",
      password: moderatorPassword,
      role: "MODERATOR",
    },
  });

  console.log("✅ Moderator user created!");
  console.log("   📧 Email: moderator@esim.com");
  console.log("   🔑 Password: mod123");
  console.log("   👤 Role: MODERATOR\n");

  // Tạo Regular user (để test)
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@esim.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@esim.com",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ Regular user created!");
  console.log("   📧 Email: user@esim.com");
  console.log("   🔑 Password: user123");
  console.log("   👤 Role: USER\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Created 3 users:");
  console.log("   1. Admin (admin@esim.com)");
  console.log("   2. Moderator (moderator@esim.com)");
  console.log("   3. User (user@esim.com)");
  console.log("");
  console.log("🔐 Testing Access:");
  console.log("   • Admin & Moderator → Can access /admin");
  console.log("   • Regular User → Redirected to /unauthorized");
  console.log("");
  console.log("🚀 Next steps:");
  console.log("   1. Go to http://localhost:3000/login");
  console.log("   2. Login with any account above");
  console.log("   3. Try accessing /admin");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

