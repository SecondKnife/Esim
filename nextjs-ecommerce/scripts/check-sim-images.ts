/**
 * Script để kiểm tra ảnh SIM vật lý trong database
 * Chạy: npx tsx scripts/check-sim-images.ts
 */

import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

async function main() {
  console.log("🔍 Kiểm tra ảnh SIM vật lý trong database...\n");

  const simProducts = await prisma.product.findMany({
    where: {
      simType: "SIM",
    },
    select: {
      id: true,
      title: true,
      category: true,
      imageURLs: true,
    },
  });

  console.log(`📦 Tìm thấy ${simProducts.length} sản phẩm SIM vật lý\n`);

  for (const product of simProducts) {
    try {
      const imageURLs = JSON.parse(product.imageURLs);
      const firstImage = Array.isArray(imageURLs) ? imageURLs[0] : imageURLs;
      
      console.log(`\n📱 ${product.title}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Image URL: ${firstImage}`);
      
      // Check if it's a valid URL
      if (!firstImage) {
        console.log(`   ❌ Không có ảnh`);
      } else if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
        console.log(`   ✅ Full URL`);
      } else if (firstImage.startsWith("data:image/")) {
        console.log(`   ✅ Base64`);
      } else {
        const fullUrl = `${R2_BASE_URL}/products/${firstImage}`;
        console.log(`   ⚠️  Relative path - Full URL: ${fullUrl}`);
      }
    } catch (error) {
      console.log(`   ❌ Lỗi parse imageURLs: ${product.imageURLs}`);
    }
  }

  console.log("\n✅ Hoàn thành kiểm tra!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

