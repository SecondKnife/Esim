/**
 * Simple seed với placeholder images (Unsplash)
 * Sau khi seed xong, bạn có thể edit sản phẩm và upload ảnh thật qua Admin Panel
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sử dụng Unsplash placeholder images
const IMAGES = {
  thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  usa: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80",
  japan: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  europe: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
  korea: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
};

async function main() {
  console.log("🚀 Bắt đầu seed database với sản phẩm eSIM...\n");

  // Xóa data cũ
  console.log("🧹 Xóa dữ liệu cũ...");
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.billboard.deleteMany({});
  console.log("✅ Đã xóa dữ liệu cũ\n");

  // Tạo categories
  console.log("📂 Tạo billboards...");
  
  // Tạo billboards với ảnh từ Unsplash (hoặc R2 nếu bạn đã upload)
  const billboards = await Promise.all([
    prisma.billboard.create({ 
      data: { 
        id: "billboard_thailand", 
        billboard: "Thailand", 
        imageURL: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_singapore", 
        billboard: "Singapore", 
        imageURL: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_usa", 
        billboard: "USA", 
        imageURL: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_japan", 
        billboard: "Japan", 
        imageURL: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_europe", 
        billboard: "Europe", 
        imageURL: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_korea", 
        billboard: "Korea", 
        imageURL: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_australia", 
        billboard: "Australia", 
        imageURL: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80" 
      } 
    }),
    prisma.billboard.create({ 
      data: { 
        id: "billboard_asia", 
        billboard: "Asia", 
        imageURL: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80" 
      } 
    }),
  ]);

  console.log(`✅ Đã tạo ${billboards.length} billboards\n`);

  console.log("📂 Tạo categories...");
  
  const categories = await Promise.all([
    prisma.category.create({ data: { id: "cat_thailand", billboard: "Thailand", billboardId: "billboard_thailand", category: "Thailand" } }),
    prisma.category.create({ data: { id: "cat_singapore", billboard: "Singapore", billboardId: "billboard_singapore", category: "Singapore" } }),
    prisma.category.create({ data: { id: "cat_usa", billboard: "USA", billboardId: "billboard_usa", category: "USA" } }),
    prisma.category.create({ data: { id: "cat_japan", billboard: "Japan", billboardId: "billboard_japan", category: "Japan" } }),
    prisma.category.create({ data: { id: "cat_europe", billboard: "Europe", billboardId: "billboard_europe", category: "Europe" } }),
    prisma.category.create({ data: { id: "cat_korea", billboard: "Korea", billboardId: "billboard_korea", category: "Korea" } }),
    prisma.category.create({ data: { id: "cat_australia", billboard: "Australia", billboardId: "billboard_australia", category: "Australia" } }),
    prisma.category.create({ data: { id: "cat_asia", billboard: "Asia", billboardId: "billboard_asia", category: "Asia" } }),
  ]);

  console.log(`✅ Đã tạo ${categories.length} categories\n`);

  // Tạo sản phẩm
  console.log("📦 Tạo sản phẩm eSIM...");

  const products = [
    // Thailand
    { title: "eSIM Thái Lan - 3GB/7 ngày", description: "Gói eSIM Thái Lan 3GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.thailand]), category: "Thailand", categoryId: categories[0].id, price: 85000, finalPrice: 75000, discount: 12, featured: true, country: "Thái Lan", region: "Đông Nam Á", dataPlan: "3GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Thái Lan - 8GB/15 ngày", description: "Gói eSIM Thái Lan 8GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.thailand]), category: "Thailand", categoryId: categories[0].id, price: 120000, featured: true, country: "Thái Lan", region: "Đông Nam Á", dataPlan: "8GB", validityDays: 15, simType: "eSIM" },
    { title: "eSIM Thái Lan - 15GB/30 ngày", description: "Gói eSIM Thái Lan 15GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G. Gói HOT nhất!", imageURLs: JSON.stringify([IMAGES.thailand]), category: "Thailand", categoryId: categories[0].id, price: 180000, finalPrice: 160000, discount: 11, featured: true, country: "Thái Lan", region: "Đông Nam Á", dataPlan: "15GB", validityDays: 30, simType: "eSIM" },
    { title: "eSIM Thái Lan - Unlimited/7 ngày", description: "Gói eSIM Thái Lan Unlimited data, hiệu lực 7 ngày. Không giới hạn!", imageURLs: JSON.stringify([IMAGES.thailand]), category: "Thailand", categoryId: categories[0].id, price: 150000, featured: true, country: "Thái Lan", region: "Đông Nam Á", dataPlan: "Unlimited", validityDays: 7, simType: "eSIM" },
    
    // Singapore
    { title: "eSIM Singapore - 5GB/7 ngày", description: "Gói eSIM Singapore 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.singapore]), category: "Singapore", categoryId: categories[1].id, price: 120000, featured: true, country: "Singapore", region: "Đông Nam Á", dataPlan: "5GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Singapore - 10GB/14 ngày", description: "Gói eSIM Singapore 10GB data, hiệu lực 14 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.singapore]), category: "Singapore", categoryId: categories[1].id, price: 180000, featured: true, country: "Singapore", region: "Đông Nam Á", dataPlan: "10GB", validityDays: 14, simType: "eSIM" },
    { title: "eSIM Singapore - Unlimited/30 ngày", description: "Gói eSIM Singapore Unlimited data, hiệu lực 30 ngày", imageURLs: JSON.stringify([IMAGES.singapore]), category: "Singapore", categoryId: categories[1].id, price: 350000, featured: true, country: "Singapore", region: "Đông Nam Á", dataPlan: "Unlimited", validityDays: 30, simType: "eSIM" },
    
    // USA
    { title: "eSIM Mỹ - 5GB/7 ngày", description: "Gói eSIM Mỹ 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.usa]), category: "USA", categoryId: categories[2].id, price: 180000, featured: true, country: "Mỹ", region: "Châu Mỹ", dataPlan: "5GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Mỹ - 15GB/15 ngày", description: "Gói eSIM Mỹ 15GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.usa]), category: "USA", categoryId: categories[2].id, price: 280000, featured: true, country: "Mỹ", region: "Châu Mỹ", dataPlan: "15GB", validityDays: 15, simType: "eSIM" },
    { title: "eSIM Mỹ - 20GB/30 ngày", description: "Gói eSIM Mỹ 20GB data, hiệu lực 30 ngày. Gói tốt nhất!", imageURLs: JSON.stringify([IMAGES.usa]), category: "USA", categoryId: categories[2].id, price: 450000, finalPrice: 400000, discount: 11, featured: true, country: "Mỹ", region: "Châu Mỹ", dataPlan: "20GB", validityDays: 30, simType: "eSIM" },
    
    // Japan
    { title: "eSIM Nhật Bản - 5GB/7 ngày", description: "Gói eSIM Nhật Bản 5GB data, hiệu lực 7 ngày. Khám phá xứ sở hoa anh đào!", imageURLs: JSON.stringify([IMAGES.japan]), category: "Japan", categoryId: categories[3].id, price: 280000, featured: true, country: "Nhật Bản", region: "Châu Á", dataPlan: "5GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Nhật Bản - 10GB/14 ngày", description: "Gói eSIM Nhật Bản 10GB data, hiệu lực 14 ngày, hỗ trợ 4G/5G", imageURLs: JSON.stringify([IMAGES.japan]), category: "Japan", categoryId: categories[3].id, price: 420000, featured: true, country: "Nhật Bản", region: "Châu Á", dataPlan: "10GB", validityDays: 14, simType: "eSIM" },
    { title: "eSIM Nhật Bản - 20GB/30 ngày", description: "Gói eSIM Nhật Bản 20GB data, hiệu lực 30 ngày", imageURLs: JSON.stringify([IMAGES.japan]), category: "Japan", categoryId: categories[3].id, price: 550000, finalPrice: 500000, discount: 9, featured: true, country: "Nhật Bản", region: "Châu Á", dataPlan: "20GB", validityDays: 30, simType: "eSIM" },
    
    // Europe
    { title: "eSIM Châu Âu - 5GB/7 ngày", description: "Gói eSIM Châu Âu 5GB data, dùng được ở 30+ quốc gia", imageURLs: JSON.stringify([IMAGES.europe]), category: "Europe", categoryId: categories[4].id, price: 200000, featured: true, country: "Châu Âu", region: "Châu Âu", dataPlan: "5GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Châu Âu - 30GB/30 ngày", description: "Gói eSIM Châu Âu 30GB data, hiệu lực 30 ngày. Khám phá toàn Châu Âu!", imageURLs: JSON.stringify([IMAGES.europe]), category: "Europe", categoryId: categories[4].id, price: 550000, finalPrice: 500000, discount: 9, featured: true, country: "Châu Âu", region: "Châu Âu", dataPlan: "30GB", validityDays: 30, simType: "eSIM" },
    
    // Korea
    { title: "eSIM Hàn Quốc - 5GB/7 ngày", description: "Gói eSIM Hàn Quốc 5GB data, hiệu lực 7 ngày. Khám phá xứ sở kim chi!", imageURLs: JSON.stringify([IMAGES.korea]), category: "Korea", categoryId: categories[5].id, price: 180000, featured: true, country: "Hàn Quốc", region: "Châu Á", dataPlan: "5GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Hàn Quốc - 20GB/30 ngày", description: "Gói eSIM Hàn Quốc 20GB data, hiệu lực 30 ngày. Gói HOT nhất!", imageURLs: JSON.stringify([IMAGES.korea]), category: "Korea", categoryId: categories[5].id, price: 480000, finalPrice: 430000, discount: 10, featured: true, country: "Hàn Quốc", region: "Châu Á", dataPlan: "20GB", validityDays: 30, simType: "eSIM" },
    
    // Australia
    { title: "eSIM Úc - 5GB/7 ngày", description: "Gói eSIM Úc 5GB data, hiệu lực 7 ngày. Khám phá xứ sở Kangaroo!", imageURLs: JSON.stringify([IMAGES.australia]), category: "Australia", categoryId: categories[6].id, price: 220000, featured: true, country: "Úc", region: "Châu Đại Dương", dataPlan: "5GB", validityDays: 7, simType: "eSIM" },
    { title: "eSIM Úc - 25GB/30 ngày", description: "Gói eSIM Úc 25GB data, hiệu lực 30 ngày. Gói đặc biệt!", imageURLs: JSON.stringify([IMAGES.australia]), category: "Australia", categoryId: categories[6].id, price: 520000, finalPrice: 470000, discount: 10, featured: true, country: "Úc", region: "Châu Đại Dương", dataPlan: "25GB", validityDays: 30, simType: "eSIM" },
  ];

  for (let i = 0; i < products.length; i++) {
    await prisma.product.create({
      data: {
        id: `prod_${i + 1}`,
        ...products[i],
      },
    });
    console.log(`   ✓ [${i + 1}/${products.length}] ${products[i].title}`);
  }

  console.log(`\n✅ Seed hoàn tất!`);
  console.log(`   📦 Đã tạo ${products.length} sản phẩm eSIM`);
  console.log(`   📂 Đã tạo ${categories.length} categories`);
  console.log(`   🖼️  Đang dùng ảnh placeholder từ Unsplash`);
  console.log(`\n📝 Tiếp theo:`);
  console.log(`   1. Chạy: npm run dev`);
  console.log(`   2. Đăng nhập Admin Panel`);
  console.log(`   3. Edit từng sản phẩm và upload ảnh thật lên R2`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

