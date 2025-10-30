/**
 * Seed database với sản phẩm eSIM sử dụng R2 URLs
 * Chạy: npx tsx scripts/seed-with-r2.ts
 */

import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// R2 Base URL from environment
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

if (!R2_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_R2_PUBLIC_URL không được cấu hình trong .env");
  process.exit(1);
}

// Mapping country images - sẽ sử dụng placeholder hoặc URLs đã upload
const getImageUrl = (imageName: string): string => {
  // Nếu bạn đã upload ảnh, thay thế bằng URLs thực tế
  // Hoặc sử dụng placeholder
  return `${R2_BASE_URL}/products/${imageName}`;
};

async function main() {
  console.log(`🚀 Bắt đầu seed database với R2 URLs...`);
  console.log(`📦 R2 Base URL: ${R2_BASE_URL}\n`);

  // Clear existing products (optional - remove if you want to keep existing)
  console.log("🧹 Xóa sản phẩm cũ...");
  await prisma.product.deleteMany({});
  console.log("✅ Đã xóa sản phẩm cũ\n");

  // Create categories
  console.log("📂 Tạo categories...");
  
  const thailandCategory = await prisma.category.upsert({
    where: { id: "category_thailand" },
    update: {},
    create: {
      id: "category_thailand",
      billboard: "Thailand",
      billboardId: "thailand",
      category: "Thailand",
    },
  });

  const singaporeCategory = await prisma.category.upsert({
    where: { id: "category_singapore" },
    update: {},
    create: {
      id: "category_singapore",
      billboard: "Singapore",
      billboardId: "singapore",
      category: "Singapore",
    },
  });

  const usaCategory = await prisma.category.upsert({
    where: { id: "category_usa" },
    update: {},
    create: {
      id: "category_usa",
      billboard: "USA",
      billboardId: "usa",
      category: "USA",
    },
  });

  const japanCategory = await prisma.category.upsert({
    where: { id: "category_japan" },
    update: {},
    create: {
      id: "category_japan",
      billboard: "Japan",
      billboardId: "japan",
      category: "Japan",
    },
  });

  const europeCategory = await prisma.category.upsert({
    where: { id: "category_europe" },
    update: {},
    create: {
      id: "category_europe",
      billboard: "Europe",
      billboardId: "europe",
      category: "Europe",
    },
  });

  const koreaCategory = await prisma.category.upsert({
    where: { id: "category_korea" },
    update: {},
    create: {
      id: "category_korea",
      billboard: "Korea",
      billboardId: "korea",
      category: "Korea",
    },
  });

  const australiaCategory = await prisma.category.upsert({
    where: { id: "category_australia" },
    update: {},
    create: {
      id: "category_australia",
      billboard: "Australia",
      billboardId: "australia",
      category: "Australia",
    },
  });

  const asiaCategory = await prisma.category.upsert({
    where: { id: "category_asia" },
    update: {},
    create: {
      id: "category_asia",
      billboard: "Asia",
      billboardId: "asia",
      category: "Asia",
    },
  });

  console.log("✅ Đã tạo 8 categories\n");

  console.log("📦 Tạo sản phẩm eSIM...");

  // Create products - Thailand
  const thaiProducts = [
    {
      title: "eSIM Thái Lan - 3GB/7 ngày",
      description: "Gói eSIM Thái Lan 3GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Kích hoạt tự động khi đến Thái Lan, không cần đăng ký phức tạp.",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: thailandCategory.id,
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
      categoryId: thailandCategory.id,
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
      description: "Gói eSIM Thái Lan 15GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Gói HOT nhất cho du lịch dài ngày!",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: thailandCategory.id,
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
      description: "Gói eSIM Thái Lan Unlimited data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Không giới hạn dung lượng, thoải mái lướt web!",
      imageURLs: JSON.stringify([getImageUrl("thailand.jpg")]),
      category: "Thailand",
      categoryId: thailandCategory.id,
      price: 150000,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "Unlimited",
      validityDays: 7,
      simType: "eSIM",
    },
  ];

  // Create products - Singapore
  const sgProducts = [
    {
      title: "eSIM Singapore - 5GB/7 ngày",
      description: "Gói eSIM Singapore 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Kết nối nhanh chóng tại Singapore.",
      imageURLs: JSON.stringify([getImageUrl("singapore.jpg")]),
      category: "Singapore",
      categoryId: singaporeCategory.id,
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
      description: "Gói eSIM Singapore 10GB data, hiệu lực 14 ngày, hỗ trợ 4G/5G. Hoàn hảo cho chuyến công tác.",
      imageURLs: JSON.stringify([getImageUrl("singapore.jpg")]),
      category: "Singapore",
      categoryId: singaporeCategory.id,
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
      categoryId: singaporeCategory.id,
      price: 350000,
      featured: true,
      country: "Singapore",
      region: "Đông Nam Á",
      dataPlan: "Unlimited",
      validityDays: 30,
      simType: "eSIM",
    },
  ];

  // Create products - USA
  const usaProducts = [
    {
      title: "eSIM Mỹ - 5GB/7 ngày",
      description: "Gói eSIM Mỹ 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Kết nối mọi nơi tại Hoa Kỳ.",
      imageURLs: JSON.stringify([getImageUrl("usa.jpg")]),
      category: "USA",
      categoryId: usaCategory.id,
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
      description: "Gói eSIM Mỹ 15GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G. Phù hợp cho chuyến du lịch khám phá.",
      imageURLs: JSON.stringify([getImageUrl("usa.jpg")]),
      category: "USA",
      categoryId: usaCategory.id,
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
      categoryId: usaCategory.id,
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
  ];

  // Create products - Japan
  const japanProducts = [
    {
      title: "eSIM Nhật Bản - 5GB/7 ngày",
      description: "Gói eSIM Nhật Bản 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Khám phá xứ sở hoa anh đào!",
      imageURLs: JSON.stringify([getImageUrl("japan.jpg")]),
      category: "Japan",
      categoryId: japanCategory.id,
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
      description: "Gói eSIM Nhật Bản 10GB data, hiệu lực 14 ngày, hỗ trợ 4G/5G. Hoàn hảo cho chuyến du lịch Nhật.",
      imageURLs: JSON.stringify([getImageUrl("japan.jpg")]),
      category: "Japan",
      categoryId: japanCategory.id,
      price: 420000,
      featured: true,
      country: "Nhật Bản",
      region: "Châu Á",
      dataPlan: "10GB",
      validityDays: 14,
      simType: "eSIM",
    },
  ];

  // Create products - Europe
  const europeProducts = [
    {
      title: "eSIM Châu Âu - 5GB/7 ngày",
      description: "Gói eSIM Châu Âu 5GB data, hiệu lực 7 ngày, dùng được ở 30+ quốc gia Châu Âu.",
      imageURLs: JSON.stringify([getImageUrl("europe.jpg")]),
      category: "Europe",
      categoryId: europeCategory.id,
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
      categoryId: europeCategory.id,
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
  ];

  // Create products - Korea
  const koreaProducts = [
    {
      title: "eSIM Hàn Quốc - 5GB/7 ngày",
      description: "Gói eSIM Hàn Quốc 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Khám phá xứ sở kim chi!",
      imageURLs: JSON.stringify([getImageUrl("korea.jpg")]),
      category: "Korea",
      categoryId: koreaCategory.id,
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
      categoryId: koreaCategory.id,
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
  ];

  // Create products - Australia
  const australiaProducts = [
    {
      title: "eSIM Úc - 5GB/7 ngày",
      description: "Gói eSIM Úc 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Khám phá xứ sở Kangaroo!",
      imageURLs: JSON.stringify([getImageUrl("australia.jpg")]),
      category: "Australia",
      categoryId: australiaCategory.id,
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
      categoryId: australiaCategory.id,
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

  // Insert all products
  const allProducts = [
    ...thaiProducts,
    ...sgProducts,
    ...usaProducts,
    ...japanProducts,
    ...europeProducts,
    ...koreaProducts,
    ...australiaProducts,
  ];

  let successCount = 0;
  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    const simpleId = `product_${i + 1}`;
    
    try {
      await prisma.product.create({
        data: {
          id: simpleId,
          ...product,
        },
      });
      successCount++;
      console.log(`   ✓ [${i + 1}/${allProducts.length}] ${product.title}`);
    } catch (error) {
      console.log(`   ✗ [${i + 1}/${allProducts.length}] ${product.title} - Lỗi: ${error}`);
    }
  }

  console.log(`\n✅ Database seeded successfully!`);
  console.log(`   📦 Đã tạo ${successCount}/${allProducts.length} sản phẩm`);
  console.log(`   📂 Đã tạo 8 categories`);
  console.log(`   🌏 Countries: Thailand, Singapore, USA, Japan, Europe, Korea, Australia`);
  console.log(`   📱 Product types: eSIM and SIM cards`);
  console.log(`   💾 Data plans: 3GB to Unlimited`);
  console.log(`   ⏰ Validity: 7 to 30 days`);
  console.log(`   ☁️  Images hosted on: ${R2_BASE_URL}`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

