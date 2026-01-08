/**
 * Seed dữ liệu vào database mới với ảnh từ R2
 * Chạy: npx tsx scripts/seed-new-database.ts
 */

import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// R2 Base URL from environment
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

if (!R2_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_R2_PUBLIC_URL không được cấu hình trong .env.local");
  process.exit(1);
}

// Helper function to get image URL from R2
const getImageUrl = (imageName: string): string => {
  return `${R2_BASE_URL}/products/${imageName}`;
};

async function main() {
  console.log("🚀 Seed Database Mới với R2 Images\n");
  console.log("====================================");
  console.log(`☁️  R2 Base URL: ${R2_BASE_URL}\n`);

  // Step 1: Clear existing data (optional)
  console.log("🧹 Bước 1: Xóa dữ liệu cũ...");
  
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productSize.deleteMany({});
    await prisma.categorySize.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.billboard.deleteMany({});
    await prisma.size.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("✅ Đã xóa dữ liệu cũ\n");
  } catch (error: any) {
    console.log("⚠️  Lỗi khi xóa dữ liệu:", error.message);
    console.log("   (Bỏ qua nếu database trống)\n");
  }

  // Step 2: Create admin user
  console.log("👤 Bước 2: Tạo admin user...");
  
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = await prisma.user.create({
    data: {
      id: "admin_user_1",
      name: "Admin",
      email: "admin@esim.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  
  console.log(`✅ Đã tạo admin: ${adminUser.email}`);
  console.log(`   Password: admin123\n`);

  // Step 3: Create categories
  console.log("📂 Bước 3: Tạo categories...");
  
  const categories = [
    { id: "cat_thailand", name: "Thailand", billboard: "Thái Lan" },
    { id: "cat_singapore", name: "Singapore", billboard: "Singapore" },
    { id: "cat_usa", name: "USA", billboard: "Hoa Kỳ" },
    { id: "cat_japan", name: "Japan", billboard: "Nhật Bản" },
    { id: "cat_europe", name: "Europe", billboard: "Châu Âu" },
    { id: "cat_korea", name: "Korea", billboard: "Hàn Quốc" },
    { id: "cat_australia", name: "Australia", billboard: "Úc" },
    { id: "cat_asia", name: "Asia", billboard: "Châu Á" },
  ];

  const createdCategories: any = {};
  
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        id: cat.id,
        billboard: cat.billboard,
        billboardId: cat.id,
        category: cat.name,
      },
    });
    createdCategories[cat.name] = category;
    console.log(`   ✓ ${cat.name}`);
  }
  
  console.log(`✅ Đã tạo ${categories.length} categories\n`);

  // Step 4: Create products
  console.log("📦 Bước 4: Tạo sản phẩm eSIM...\n");

  const products = [
    // Thailand Products
    {
      title: "eSIM Thái Lan - 3GB/7 ngày",
      description: "Gói eSIM Thái Lan 3GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Kích hoạt tự động khi đến Thái Lan.",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: createdCategories["Thailand"].id,
      price: 85000,
      finalPrice: 75000,
      discount: 12,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "3GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Thái Lan - 8GB/15 ngày",
      description: "Gói eSIM Thái Lan 8GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G. Phù hợp cho chuyến du lịch dài ngày.",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: createdCategories["Thailand"].id,
      price: 120000,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "8GB",
      validityDays: 15,
      simType: "eSIM",
    },
    {
      title: "eSIM Thái Lan - 15GB/30 ngày",
      description: "Gói eSIM Thái Lan 15GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Gói HOT nhất!",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: createdCategories["Thailand"].id,
      price: 180000,
      finalPrice: 160000,
      discount: 11,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "15GB",
      validityDays: 30,
      simType: "eSIM",
    },
    {
      title: "eSIM Thái Lan - Unlimited/7 ngày",
      description: "Gói eSIM Thái Lan Unlimited data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Không giới hạn!",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: createdCategories["Thailand"].id,
      price: 150000,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "Unlimited",
      validityDays: 7,
      simType: "eSIM",
    },

    // Singapore Products
    {
      title: "eSIM Singapore - 5GB/7 ngày",
      description: "Gói eSIM Singapore 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Kết nối nhanh tại Singapore.",
      imageURLs: JSON.stringify([getImageUrl("singapore.jpg")]),
      category: "Singapore",
      categoryId: createdCategories["Singapore"].id,
      price: 120000,
      featured: true,
      country: "Singapore",
      region: "Đông Nam Á",
      dataPlan: "5GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Singapore - 10GB/14 ngày",
      description: "Gói eSIM Singapore 10GB data, hiệu lực 14 ngày, hỗ trợ 4G/5G. Hoàn hảo cho công tác.",
      imageURLs: JSON.stringify([getImageUrl("singapore.jpg")]),
      category: "Singapore",
      categoryId: createdCategories["Singapore"].id,
      price: 180000,
      featured: true,
      country: "Singapore",
      region: "Đông Nam Á",
      dataPlan: "10GB",
      validityDays: 14,
      simType: "eSIM",
    },
    {
      title: "eSIM Singapore - Unlimited/30 ngày",
      description: "Gói eSIM Singapore Unlimited data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Dùng không giới hạn!",
      imageURLs: JSON.stringify([getImageUrl("singapore.jpg")]),
      category: "Singapore",
      categoryId: createdCategories["Singapore"].id,
      price: 350000,
      finalPrice: 320000,
      discount: 9,
      featured: true,
      country: "Singapore",
      region: "Đông Nam Á",
      dataPlan: "Unlimited",
      validityDays: 30,
      simType: "eSIM",
    },

    // USA Products
    {
      title: "eSIM Mỹ - 5GB/7 ngày",
      description: "Gói eSIM Mỹ 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Kết nối mọi nơi tại Hoa Kỳ.",
      imageURLs: JSON.stringify([getImageUrl("usa.jpg")]),
      category: "USA",
      categoryId: createdCategories["USA"].id,
      price: 180000,
      featured: true,
      country: "Mỹ",
      region: "Châu Mỹ",
      dataPlan: "5GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Mỹ - 15GB/15 ngày",
      description: "Gói eSIM Mỹ 15GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G. Phù hợp cho du lịch khám phá.",
      imageURLs: JSON.stringify([getImageUrl("usa.jpg")]),
      category: "USA",
      categoryId: createdCategories["USA"].id,
      price: 280000,
      featured: true,
      country: "Mỹ",
      region: "Châu Mỹ",
      dataPlan: "15GB",
      validityDays: 15,
      simType: "eSIM",
    },
    {
      title: "eSIM Mỹ - 20GB/30 ngày",
      description: "Gói eSIM Mỹ 20GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Gói tốt nhất cho công tác dài ngày.",
      imageURLs: JSON.stringify([getImageUrl("usa.jpg")]),
      category: "USA",
      categoryId: createdCategories["USA"].id,
      price: 450000,
      finalPrice: 400000,
      discount: 11,
      featured: true,
      country: "Mỹ",
      region: "Châu Mỹ",
      dataPlan: "20GB",
      validityDays: 30,
      simType: "eSIM",
    },

    // Japan Products
    {
      title: "eSIM Nhật Bản - 5GB/7 ngày",
      description: "Gói eSIM Nhật Bản 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Khám phá xứ hoa anh đào!",
      imageURLs: JSON.stringify([getImageUrl("japan.jpg")]),
      category: "Japan",
      categoryId: createdCategories["Japan"].id,
      price: 280000,
      featured: true,
      country: "Nhật Bản",
      region: "Châu Á",
      dataPlan: "5GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Nhật Bản - 10GB/14 ngày",
      description: "Gói eSIM Nhật Bản 10GB data, hiệu lực 14 ngày, hỗ trợ 4G/5G. Hoàn hảo cho chuyến du lịch.",
      imageURLs: JSON.stringify([getImageUrl("japan.jpg")]),
      category: "Japan",
      categoryId: createdCategories["Japan"].id,
      price: 420000,
      finalPrice: 380000,
      discount: 10,
      featured: true,
      country: "Nhật Bản",
      region: "Châu Á",
      dataPlan: "10GB",
      validityDays: 14,
      simType: "eSIM",
    },

    // Europe Products
    {
      title: "eSIM Châu Âu - 5GB/7 ngày",
      description: "Gói eSIM Châu Âu 5GB data, hiệu lực 7 ngày, dùng được ở 30+ quốc gia Châu Âu.",
      imageURLs: JSON.stringify([getImageUrl("europe.jpg")]),
      category: "Europe",
      categoryId: createdCategories["Europe"].id,
      price: 200000,
      featured: true,
      country: "Châu Âu",
      region: "Châu Âu",
      dataPlan: "5GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Châu Âu - 30GB/30 ngày",
      description: "Gói eSIM Châu Âu 30GB data, hiệu lực 30 ngày, khám phá toàn bộ Châu Âu!",
      imageURLs: JSON.stringify([getImageUrl("europe.jpg")]),
      category: "Europe",
      categoryId: createdCategories["Europe"].id,
      price: 550000,
      finalPrice: 500000,
      discount: 9,
      featured: true,
      country: "Châu Âu",
      region: "Châu Âu",
      dataPlan: "30GB",
      validityDays: 30,
      simType: "eSIM",
    },

    // Korea Products
    {
      title: "eSIM Hàn Quốc - 5GB/7 ngày",
      description: "Gói eSIM Hàn Quốc 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Khám phá xứ sở kim chi!",
      imageURLs: JSON.stringify([getImageUrl("korea.jpg")]),
      category: "Korea",
      categoryId: createdCategories["Korea"].id,
      price: 180000,
      featured: true,
      country: "Hàn Quốc",
      region: "Châu Á",
      dataPlan: "5GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Hàn Quốc - 20GB/30 ngày",
      description: "Gói eSIM Hàn Quốc 20GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Gói HOT nhất!",
      imageURLs: JSON.stringify([getImageUrl("korea.jpg")]),
      category: "Korea",
      categoryId: createdCategories["Korea"].id,
      price: 480000,
      finalPrice: 430000,
      discount: 10,
      featured: true,
      country: "Hàn Quốc",
      region: "Châu Á",
      dataPlan: "20GB",
      validityDays: 30,
      simType: "eSIM",
    },

    // Australia Products
    {
      title: "eSIM Úc - 5GB/7 ngày",
      description: "Gói eSIM Úc 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Khám phá xứ sở Kangaroo!",
      imageURLs: JSON.stringify([getImageUrl("australia.jpg")]),
      category: "Australia",
      categoryId: createdCategories["Australia"].id,
      price: 220000,
      featured: true,
      country: "Úc",
      region: "Châu Đại Dương",
      dataPlan: "5GB",
      validityDays: 7,
      simType: "eSIM",
    },
    {
      title: "eSIM Úc - 25GB/30 ngày",
      description: "Gói eSIM Úc 25GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Gói đặc biệt cho du học sinh!",
      imageURLs: JSON.stringify([getImageUrl("australia.jpg")]),
      category: "Australia",
      categoryId: createdCategories["Australia"].id,
      price: 520000,
      finalPrice: 470000,
      discount: 10,
      featured: true,
      country: "Úc",
      region: "Châu Đại Dương",
      dataPlan: "25GB",
      validityDays: 30,
      simType: "eSIM",
    },
  ];

  let successCount = 0;
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productId = `product_${(i + 1).toString().padStart(3, '0')}`;
    
    try {
      await prisma.product.create({
        data: {
          id: productId,
          ...product,
        },
      });
      successCount++;
      console.log(`   ✓ [${i + 1}/${products.length}] ${product.title}`);
    } catch (error: any) {
      console.log(`   ✗ [${i + 1}/${products.length}] ${product.title} - Lỗi: ${error.message}`);
    }
  }

  console.log(`\n✅ Đã tạo ${successCount}/${products.length} sản phẩm`);

  // Summary
  console.log("\n====================================");
  console.log("🎉 Seed Database Hoàn Tất!\n");
  console.log("📊 Thống kê:");
  console.log(`   👤 Users: 1 admin`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   📦 Products: ${successCount}`);
  console.log(`   ☁️  Images: R2 Storage`);
  console.log("\n🔐 Thông tin đăng nhập admin:");
  console.log(`   Email: admin@esim.com`);
  console.log(`   Password: admin123`);
  console.log("\n====================================\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

