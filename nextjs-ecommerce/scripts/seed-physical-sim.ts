/**
 * Seed sản phẩm SIM vật lý vào database
 * Chạy: npx tsx scripts/seed-physical-sim.ts
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

// Get image URL for a category
const getCategoryImageUrl = (category: string): string => {
  const imageKey = CATEGORY_TO_IMAGE_KEY[category];
  
  // Try to get actual URL from uploaded-images.json first
  if (imageKey && UPLOADED_IMAGES[imageKey]) {
    // Use actual URL from uploaded-images.json (includes timestamp)
    return UPLOADED_IMAGES[imageKey];
  }
  
  // Fallback to constructed URL
  const imageFilename = CATEGORY_TO_IMAGE_FALLBACK[category] || "thailand.jpg";
  return getImageUrl(imageFilename);
};

async function main() {
  console.log("🚀 Seed SIM Vật Lý vào Database\n");
  console.log("====================================");
  console.log(`☁️  R2 Base URL: ${R2_BASE_URL}\n`);

  try {
    // Get all categories
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      console.error("❌ Không tìm thấy categories. Vui lòng seed categories trước.");
      process.exit(1);
    }

    console.log(`✅ Tìm thấy ${categories.length} categories\n`);

    // Map category names to category IDs
    const categoryMap: { [key: string]: string } = {};
    categories.forEach((cat) => {
      categoryMap[cat.category] = cat.id;
    });

    // Physical SIM products data
    const physicalSimProducts = [
      // Thailand SIM Cards
      {
        title: "SIM Thái Lan - 5GB/7 ngày",
        description: "SIM vật lý Thái Lan 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Giao hàng tận nơi trong 2-3 ngày.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Thailand")]),
        category: "Thailand",
        categoryId: categoryMap["Thailand"],
        price: 120000,
        finalPrice: null,
        discount: null,
        featured: false,
        country: "Thái Lan",
        region: "Đông Nam Á",
        dataPlan: "5GB",
        validityDays: 7,
        simType: "SIM",
      },
      {
        title: "SIM Thái Lan - 10GB/15 ngày",
        description: "SIM vật lý Thái Lan 10GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G. Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Thailand")]),
        category: "Thailand",
        categoryId: categoryMap["Thailand"],
        price: 180000,
        finalPrice: 160000,
        discount: 11,
        featured: true,
        country: "Thái Lan",
        region: "Đông Nam Á",
        dataPlan: "10GB",
        validityDays: 15,
        simType: "SIM",
      },
      {
        title: "SIM Thái Lan - 20GB/30 ngày",
        description: "SIM vật lý Thái Lan 20GB data, hiệu lực 30 ngày. Gói HOT nhất! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Thailand")]),
        category: "Thailand",
        categoryId: categoryMap["Thailand"],
        price: 280000,
        finalPrice: 250000,
        discount: 11,
        featured: true,
        country: "Thái Lan",
        region: "Đông Nam Á",
        dataPlan: "20GB",
        validityDays: 30,
        simType: "SIM",
      },

      // Singapore SIM Cards
      {
        title: "SIM Singapore - 5GB/7 ngày",
        description: "SIM vật lý Singapore 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G. Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Singapore")]),
        category: "Singapore",
        categoryId: categoryMap["Singapore"],
        price: 150000,
        featured: false,
        country: "Singapore",
        region: "Đông Nam Á",
        dataPlan: "5GB",
        validityDays: 7,
        simType: "SIM",
      },
      {
        title: "SIM Singapore - 15GB/30 ngày",
        description: "SIM vật lý Singapore 15GB data, hiệu lực 30 ngày. Gói tốt nhất! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Singapore")]),
        category: "Singapore",
        categoryId: categoryMap["Singapore"],
        price: 320000,
        finalPrice: 290000,
        discount: 9,
        featured: true,
        country: "Singapore",
        region: "Đông Nam Á",
        dataPlan: "15GB",
        validityDays: 30,
        simType: "SIM",
      },

      // USA SIM Cards
      {
        title: "SIM Mỹ - 10GB/15 ngày",
        description: "SIM vật lý Mỹ 10GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G. Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("USA")]),
        category: "USA",
        categoryId: categoryMap["USA"],
        price: 350000,
        featured: false,
        country: "Mỹ",
        region: "Châu Mỹ",
        dataPlan: "10GB",
        validityDays: 15,
        simType: "SIM",
      },
      {
        title: "SIM Mỹ - 25GB/30 ngày",
        description: "SIM vật lý Mỹ 25GB data, hiệu lực 30 ngày. Gói HOT nhất! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("USA")]),
        category: "USA",
        categoryId: categoryMap["USA"],
        price: 550000,
        finalPrice: 500000,
        discount: 9,
        featured: true,
        country: "Mỹ",
        region: "Châu Mỹ",
        dataPlan: "25GB",
        validityDays: 30,
        simType: "SIM",
      },

      // Japan SIM Cards
      {
        title: "SIM Nhật Bản - 8GB/14 ngày",
        description: "SIM vật lý Nhật Bản 8GB data, hiệu lực 14 ngày. Khám phá xứ sở hoa anh đào! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Japan")]),
        category: "Japan",
        categoryId: categoryMap["Japan"],
        price: 420000,
        featured: false,
        country: "Nhật Bản",
        region: "Châu Á",
        dataPlan: "8GB",
        validityDays: 14,
        simType: "SIM",
      },
      {
        title: "SIM Nhật Bản - 20GB/30 ngày",
        description: "SIM vật lý Nhật Bản 20GB data, hiệu lực 30 ngày. Gói tốt nhất! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Japan")]),
        category: "Japan",
        categoryId: categoryMap["Japan"],
        price: 680000,
        finalPrice: 620000,
        discount: 9,
        featured: true,
        country: "Nhật Bản",
        region: "Châu Á",
        dataPlan: "20GB",
        validityDays: 30,
        simType: "SIM",
      },

      // Europe SIM Cards
      {
        title: "SIM Châu Âu - 10GB/15 ngày",
        description: "SIM vật lý Châu Âu 10GB data, dùng được ở 30+ quốc gia. Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Europe")]),
        category: "Europe",
        categoryId: categoryMap["Europe"],
        price: 380000,
        featured: false,
        country: "Châu Âu",
        region: "Châu Âu",
        dataPlan: "10GB",
        validityDays: 15,
        simType: "SIM",
      },
      {
        title: "SIM Châu Âu - 30GB/30 ngày",
        description: "SIM vật lý Châu Âu 30GB data, hiệu lực 30 ngày. Khám phá toàn Châu Âu! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Europe")]),
        category: "Europe",
        categoryId: categoryMap["Europe"],
        price: 680000,
        finalPrice: 620000,
        discount: 9,
        featured: true,
        country: "Châu Âu",
        region: "Châu Âu",
        dataPlan: "30GB",
        validityDays: 30,
        simType: "SIM",
      },

      // Korea SIM Cards
      {
        title: "SIM Hàn Quốc - 10GB/14 ngày",
        description: "SIM vật lý Hàn Quốc 10GB data, hiệu lực 14 ngày. Khám phá xứ sở kim chi! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Korea")]),
        category: "Korea",
        categoryId: categoryMap["Korea"],
        price: 350000,
        featured: false,
        country: "Hàn Quốc",
        region: "Châu Á",
        dataPlan: "10GB",
        validityDays: 14,
        simType: "SIM",
      },
      {
        title: "SIM Hàn Quốc - 25GB/30 ngày",
        description: "SIM vật lý Hàn Quốc 25GB data, hiệu lực 30 ngày. Gói HOT nhất! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Korea")]),
        category: "Korea",
        categoryId: categoryMap["Korea"],
        price: 620000,
        finalPrice: 570000,
        discount: 8,
        featured: true,
        country: "Hàn Quốc",
        region: "Châu Á",
        dataPlan: "25GB",
        validityDays: 30,
        simType: "SIM",
      },

      // Australia SIM Cards
      {
        title: "SIM Úc - 10GB/14 ngày",
        description: "SIM vật lý Úc 10GB data, hiệu lực 14 ngày. Khám phá xứ sở Kangaroo! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Australia")]),
        category: "Australia",
        categoryId: categoryMap["Australia"],
        price: 380000,
        featured: false,
        country: "Úc",
        region: "Châu Đại Dương",
        dataPlan: "10GB",
        validityDays: 14,
        simType: "SIM",
      },
      {
        title: "SIM Úc - 30GB/30 ngày",
        description: "SIM vật lý Úc 30GB data, hiệu lực 30 ngày. Gói đặc biệt! Giao hàng tận nơi.",
        imageURLs: JSON.stringify([getCategoryImageUrl("Australia")]),
        category: "Australia",
        categoryId: categoryMap["Australia"],
        price: 680000,
        finalPrice: 630000,
        discount: 7,
        featured: true,
        country: "Úc",
        region: "Châu Đại Dương",
        dataPlan: "30GB",
        validityDays: 30,
        simType: "SIM",
      },
    ];

    console.log("📦 Bắt đầu tạo SIM vật lý...\n");

    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of physicalSimProducts) {
      try {
        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: {
            title: productData.title,
            simType: "SIM",
          },
        });

        if (existingProduct) {
          console.log(`⏭️  Đã tồn tại: ${productData.title}`);
          skippedCount++;
          continue;
        }

        // Create product
        const product = await prisma.product.create({
          data: {
            title: productData.title,
            description: productData.description,
            imageURLs: productData.imageURLs,
            category: productData.category,
            categoryId: productData.categoryId,
            price: productData.price,
            finalPrice: productData.finalPrice || null,
            discount: productData.discount || null,
            featured: productData.featured,
            country: productData.country,
            region: productData.region,
            dataPlan: productData.dataPlan,
            validityDays: productData.validityDays,
            simType: productData.simType,
          },
        });

        console.log(`✅ Đã tạo: ${product.title}`);
        createdCount++;

        // Small delay to avoid overwhelming the database
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error(`❌ Lỗi khi tạo ${productData.title}:`, error.message);
      }
    }

    console.log("\n====================================");
    console.log(`✅ Hoàn thành!`);
    console.log(`   - Đã tạo: ${createdCount} sản phẩm SIM vật lý`);
    console.log(`   - Đã bỏ qua: ${skippedCount} sản phẩm (đã tồn tại)`);
    console.log("\n💡 Lưu ý:");
    console.log("   - SIM vật lý hiện đang sử dụng ảnh eSIM cùng category");
    console.log("   - Ảnh được lấy từ R2:");
    console.log("     - products/thailand.jpg");
    console.log("     - products/singapore.jpg");
    console.log("     - products/usa.jpg");
    console.log("     - products/japan.jpg");
    console.log("     - products/europe.jpg");
    console.log("     - products/korea.jpg");
    console.log("     - products/australia.jpg");
    console.log("   - Nếu muốn ảnh riêng cho SIM vật lý, upload lên R2 và chạy:");
    console.log("     npx tsx scripts/update-physical-sim-images.ts");
    console.log("\n🛒 SIM vật lý sẽ hỗ trợ thanh toán COD (Cash on Delivery)");
  } catch (error: any) {
    console.error("❌ Lỗi khi seed SIM vật lý:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("\n🎉 Seed SIM vật lý hoàn tất!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed SIM vật lý thất bại:", error);
    process.exit(1);
  });

