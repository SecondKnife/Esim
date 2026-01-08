/**
 * Cập nhật ảnh cho các sản phẩm SIM vật lý đã có trong database
 * Sử dụng ảnh từ eSIM cùng category hoặc category images
 * Chạy: npx tsx scripts/update-physical-sim-images.ts
 */

import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

let UPLOADED_IMAGES: { [key: string]: string } = {};

try {
  const uploadedImagesPath = path.join(__dirname, 'uploaded-images.json');
  if (fs.existsSync(uploadedImagesPath)) {
    const uploadedImagesContent = fs.readFileSync(uploadedImagesPath, 'utf-8');
    UPLOADED_IMAGES = JSON.parse(uploadedImagesContent);
    console.log("✅ Loaded image URLs from uploaded-images.json");
  }
} catch (error) {
  console.warn("⚠️  Could not load uploaded-images.json, using fallback mapping");
}

// Mapping category to image key in uploaded-images.json
const CATEGORY_TO_IMAGE_KEY: { [key: string]: string } = {
  "Thailand": "thailand",
  "Singapore": "singapore",
  "USA": "usa",
  "Japan": "japan",
  "Europe": "europe",
  "Korea": "korea",
  "Australia": "australia",
};

// Fallback mapping if uploaded-images.json doesn't exist
const CATEGORY_TO_IMAGE_FALLBACK: { [key: string]: string } = {
  "Thailand": "thailand.jpg",
  "Singapore": "singapore.jpg",
  "USA": "usa.jpg",
  "Japan": "japan.jpg",
  "Europe": "europe.jpg",
  "Korea": "korea.jpg",
  "Australia": "australia.jpg",
};

async function main() {
  console.log("🖼️  Cập nhật ảnh cho SIM vật lý\n");
  console.log("====================================");
  console.log(`☁️  R2 Base URL: ${R2_BASE_URL}\n`);

  try {
    // Get all physical SIM products
    const physicalSims = await prisma.product.findMany({
      where: {
        simType: "SIM",
      },
    });

    if (physicalSims.length === 0) {
      console.log("ℹ️  Không tìm thấy sản phẩm SIM vật lý nào trong database.");
      console.log("   Vui lòng chạy seed-physical-sim.ts trước.");
      return;
    }

    console.log(`📦 Tìm thấy ${physicalSims.length} sản phẩm SIM vật lý\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const sim of physicalSims) {
      try {
        // Get image key based on category
        const imageKey = CATEGORY_TO_IMAGE_KEY[sim.category];
        
        if (!imageKey) {
          console.log(`⚠️  Bỏ qua: ${sim.title} (không có ảnh cho category: ${sim.category})`);
          skippedCount++;
          continue;
        }

        // Try to get actual URL from uploaded-images.json first
        let imageUrl: string;
        if (UPLOADED_IMAGES[imageKey]) {
          // Use actual URL from uploaded-images.json (includes timestamp)
          imageUrl = UPLOADED_IMAGES[imageKey];
        } else {
          // Fallback to constructed URL
          const imageFilename = CATEGORY_TO_IMAGE_FALLBACK[sim.category];
          imageUrl = getImageUrl(imageFilename);
        }

        // Check if image URL is already correct
        const currentImageUrls = JSON.parse(sim.imageURLs);
        if (Array.isArray(currentImageUrls) && currentImageUrls[0] === imageUrl) {
          console.log(`✓ Đã đúng: ${sim.title}`);
          skippedCount++;
          continue;
        }

        // Update product with new image URL
        await prisma.product.update({
          where: { id: sim.id },
          data: {
            imageURLs: JSON.stringify([imageUrl]),
          },
        });

        console.log(`✅ Đã cập nhật: ${sim.title}`);
        console.log(`   Ảnh: ${imageUrl}`);
        updatedCount++;

        // Small delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error(`❌ Lỗi khi cập nhật ${sim.title}:`, error.message);
      }
    }

    console.log("\n====================================");
    console.log(`✅ Hoàn thành!`);
    console.log(`   - Đã cập nhật: ${updatedCount} sản phẩm`);
    console.log(`   - Đã bỏ qua: ${skippedCount} sản phẩm (đã đúng hoặc không có ảnh)`);
    console.log("\n💡 Lưu ý:");
    console.log("   - Ảnh SIM vật lý sử dụng cùng ảnh với eSIM cùng category");
    console.log("   - Nếu muốn ảnh riêng, upload lên R2 và cập nhật lại");
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật ảnh:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("\n🎉 Cập nhật ảnh SIM vật lý hoàn tất!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Cập nhật ảnh SIM vật lý thất bại:", error);
    process.exit(1);
  });

