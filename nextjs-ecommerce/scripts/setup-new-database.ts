/**
 * Setup và verify database mới
 * Chạy: npx tsx scripts/setup-new-database.ts
 */

import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Setup Database Mới\n");
  console.log("====================================");

  // Step 1: Verify environment variables
  console.log("\n📋 Bước 1: Kiểm tra biến môi trường...");
  
  const requiredEnvVars = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'R2_ACCOUNT_ID': process.env.R2_ACCOUNT_ID,
    'R2_ACCESS_KEY_ID': process.env.R2_ACCESS_KEY_ID,
    'R2_SECRET_ACCESS_KEY': process.env.R2_SECRET_ACCESS_KEY,
    'R2_BUCKET_NAME': process.env.R2_BUCKET_NAME,
    'NEXT_PUBLIC_R2_PUBLIC_URL': process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  };

  let missingVars: string[] = [];
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.includes('YOUR_')) {
      console.log(`   ❌ ${key} - Chưa được cấu hình`);
      missingVars.push(key);
    } else {
      // Mask sensitive data
      const maskedValue = value.length > 20 
        ? value.substring(0, 20) + '...' 
        : value;
      console.log(`   ✅ ${key} - ${maskedValue}`);
    }
  }

  if (missingVars.length > 0) {
    console.log(`\n❌ Thiếu ${missingVars.length} biến môi trường!`);
    console.log(`\nHãy tạo file .env.local và cấu hình các biến sau:`);
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log(`\nXem file .env.local.example để biết format đúng.`);
    process.exit(1);
  }

  console.log("\n✅ Tất cả biến môi trường đã được cấu hình!");

  // Step 2: Test database connection
  console.log("\n📡 Bước 2: Kiểm tra kết nối database...");
  
  try {
    await prisma.$connect();
    console.log("✅ Kết nối database thành công!");

    // Test query
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("   Database:", result);

  } catch (error: any) {
    console.log("❌ Không thể kết nối database!");
    console.log("   Lỗi:", error.message);
    console.log("\n💡 Kiểm tra lại:");
    console.log("   1. DATABASE_URL có đúng format pooler không?");
    console.log("   2. Password đã được encode chưa? (dấu @ → %40)");
    console.log("   3. Region có đúng không? (ap-southeast-2)");
    process.exit(1);
  }

  // Step 3: Check existing tables
  console.log("\n📊 Bước 3: Kiểm tra tables hiện tại...");
  
  try {
    const tables: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log("⚠️  Chưa có table nào trong database!");
      console.log("   Hãy chạy: npm run prisma:migrate");
    } else {
      console.log(`✅ Tìm thấy ${tables.length} tables:`);
      tables.forEach((t: any) => {
        console.log(`   - ${t.table_name}`);
      });
    }
  } catch (error: any) {
    console.log("⚠️  Không thể kiểm tra tables:", error.message);
  }

  // Step 4: Check data
  console.log("\n📦 Bước 4: Kiểm tra dữ liệu hiện tại...");
  
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const userCount = await prisma.user.count();

    console.log(`   Products: ${productCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Users: ${userCount}`);

    if (productCount === 0) {
      console.log("\n💡 Database trống! Hãy chạy seed data:");
      console.log("   npx tsx scripts/seed-new-database.ts");
    }
  } catch (error: any) {
    console.log("⚠️  Không thể kiểm tra dữ liệu:", error.message);
    console.log("   (Có thể tables chưa được tạo)");
  }

  console.log("\n====================================");
  console.log("✅ Setup hoàn tất!\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

