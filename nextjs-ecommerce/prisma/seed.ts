import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const thailandCategory = await prisma.category.upsert({
    where: { id: "category_thailand" },
    update: {},
    create: {
      id: "category_thailand",
      billboard: "Thái Lan",
      billboardId: "thailand",
      category: "Thái Lan",
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
      billboard: "Mỹ",
      billboardId: "usa",
      category: "Mỹ",
    },
  });

  const japanCategory = await prisma.category.upsert({
    where: { id: "category_japan" },
    update: {},
    create: {
      id: "category_japan",
      billboard: "Nhật Bản",
      billboardId: "japan",
      category: "Nhật Bản",
    },
  });

  // Create products - eSIM/SIM Thailand
  const thaiProducts = [
    {
      title: "eSIM Thái Lan - 8GB/30 ngày",
      description: "Gói eSIM Thái Lan 8GB data, hiệu lực 30 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/thailand.png"]),
      category: "Thái Lan",
      categoryId: thailandCategory.id,
      price: 150000,
      finalPrice: 135000,
      discount: 10,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "8GB",
      validityDays: 30,
      simType: "eSIM",
    },
    {
      title: "SIM Thái Lan - 15GB/30 ngày",
      description: "Gói SIM Thái Lan 15GB data, hiệu lực 30 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/thailand.png"]),
      category: "Thái Lan",
      categoryId: thailandCategory.id,
      price: 250000,
      finalPrice: 225000,
      discount: 10,
      featured: true,
      country: "Thái Lan",
      region: "Đông Nam Á",
      dataPlan: "15GB",
      validityDays: 30,
      simType: "SIM",
    },
  ];

  // Create products - eSIM Singapore
  const sgProducts = [
    {
      title: "eSIM Singapore - 10GB/14 ngày",
      description: "Gói eSIM Singapore 10GB data, hiệu lực 14 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/singapore.png"]),
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
      title: "eSIM Singapore & Malaysia - 12GB/14 ngày",
      description: "Gói eSIM Singapore & Malaysia 12GB data, hiệu lực 14 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/sing-malay.png"]),
      category: "Singapore",
      categoryId: singaporeCategory.id,
      price: 220000,
      featured: true,
      country: "Singapore & Malaysia",
      region: "Đông Nam Á",
      dataPlan: "12GB",
      validityDays: 14,
      simType: "eSIM",
    },
  ];

  // Create products - eSIM USA
  const usaProducts = [
    {
      title: "eSIM Mỹ - 20GB/30 ngày",
      description: "Gói eSIM Mỹ 20GB data, hiệu lực 30 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/usa.png"]),
      category: "Mỹ",
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
    {
      title: "eSIM Mỹ & Canada - Unlimited/30 ngày",
      description: "Gói eSIM Mỹ & Canada Unlimited data, hiệu lực 30 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/usa-canada.png"]),
      category: "Mỹ",
      categoryId: usaCategory.id,
      price: 650000,
      featured: true,
      country: "Mỹ & Canada",
      region: "Châu Mỹ",
      dataPlan: "Unlimited",
      validityDays: 30,
      simType: "eSIM",
    },
  ];

  // Create products - eSIM Japan
  const japanProducts = [
    {
      title: "eSIM Nhật Bản - 5GB/7 ngày",
      description: "Gói eSIM Nhật Bản 5GB data, hiệu lực 7 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/japan.png"]),
      category: "Nhật Bản",
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
      title: "eSIM Nhật & Hàn - 10GB/14 ngày",
      description: "Gói eSIM Nhật & Hàn 10GB data, hiệu lực 14 ngày, hỗ trợ 5G",
      imageURLs: JSON.stringify(["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/japan-korea.png"]),
      category: "Nhật Bản",
      categoryId: japanCategory.id,
      price: 420000,
      featured: true,
      country: "Nhật & Hàn",
      region: "Châu Á",
      dataPlan: "10GB",
      validityDays: 14,
      simType: "eSIM",
    },
  ];

  // Insert all products
  const allProducts = [
    ...thaiProducts,
    ...sgProducts,
    ...usaProducts,
    ...japanProducts,
  ];

  for (const product of allProducts) {
    await prisma.product.upsert({
      where: { id: `product_${product.title.replace(/\s+/g, "_")}` },
      update: {},
      create: {
        id: `product_${product.title.replace(/\s+/g, "_")}`,
        ...product,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   Created ${allProducts.length} products`);
  console.log(`   Created 4 categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
