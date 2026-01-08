import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with UUID IDs...");

  // Delete all existing data
  await prisma.productSize.deleteMany();
  await prisma.categorySize.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.billboard.deleteMany();
  await prisma.size.deleteMany();

  // Create categories (UUID auto-generated)
  const thailand = await prisma.category.create({
    data: {
      billboard: "Thailand",
      billboardId: "billboard_thailand",
      category: "Thailand",
    },
  });

  const singapore = await prisma.category.create({
    data: {
      billboard: "Singapore",
      billboardId: "billboard_singapore",
      category: "Singapore",
    },
  });

  const usa = await prisma.category.create({
    data: {
      billboard: "USA",
      billboardId: "billboard_usa",
      category: "USA",
    },
  });

  const japan = await prisma.category.create({
    data: {
      billboard: "Japan",
      billboardId: "billboard_japan",
      category: "Japan",
    },
  });

  const europe = await prisma.category.create({
    data: {
      billboard: "Europe",
      billboardId: "billboard_europe",
      category: "Europe",
    },
  });

  const korea = await prisma.category.create({
    data: {
      billboard: "Korea",
      billboardId: "billboard_korea",
      category: "Korea",
    },
  });

  const australia = await prisma.category.create({
    data: {
      billboard: "Australia",
      billboardId: "billboard_australia",
      category: "Australia",
    },
  });

  const asia = await prisma.category.create({
    data: {
      billboard: "Asia",
      billboardId: "billboard_asia",
      category: "Asia",
    },
  });

  console.log("✅ Created 8 categories with UUID IDs");

  // Create products
  const products = [];

  // Thailand products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Thái Lan - 5GB/7 ngày",
        description: "Gói eSIM Thái Lan 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/thailand.png"]',
        category: "Thailand",
        categoryId: thailand.id,
        price: 150000,
        finalPrice: 120000,
        discount: 20,
        featured: true,
        country: "Thái Lan",
        region: "Đông Nam Á",
        dataPlan: "5GB",
        validityDays: 7,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "SIM Thái Lan - 10GB/15 ngày",
        description: "Gói SIM Thái Lan 10GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/thailand.png"]',
        category: "Thailand",
        categoryId: thailand.id,
        price: 250000,
        featured: false,
        country: "Thái Lan",
        region: "Đông Nam Á",
        dataPlan: "10GB",
        validityDays: 15,
        simType: "SIM",
      },
    })
  );

  // Singapore products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Singapore - 3GB/7 ngày",
        description: "Gói eSIM Singapore 3GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/singapore.png"]',
        category: "Singapore",
        categoryId: singapore.id,
        price: 180000,
        finalPrice: 150000,
        discount: 17,
        featured: true,
        country: "Singapore",
        region: "Đông Nam Á",
        dataPlan: "3GB",
        validityDays: 7,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Singapore - 20GB/30 ngày",
        description: "Gói eSIM Singapore 20GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/singapore.png"]',
        category: "Singapore",
        categoryId: singapore.id,
        price: 450000,
        featured: false,
        country: "Singapore",
        region: "Đông Nam Á",
        dataPlan: "20GB",
        validityDays: 30,
        simType: "eSIM",
      },
    })
  );

  // USA products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM USA - 10GB/15 ngày",
        description: "Gói eSIM USA 10GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/usa.png"]',
        category: "USA",
        categoryId: usa.id,
        price: 350000,
        finalPrice: 300000,
        discount: 14,
        featured: true,
        country: "Mỹ",
        region: "Bắc Mỹ",
        dataPlan: "10GB",
        validityDays: 15,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM USA - Unlimited/30 ngày",
        description: "Gói eSIM USA Unlimited data, hiệu lực 30 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/usa.png"]',
        category: "USA",
        categoryId: usa.id,
        price: 850000,
        finalPrice: 750000,
        discount: 12,
        featured: true,
        country: "Mỹ",
        region: "Bắc Mỹ",
        dataPlan: "Unlimited",
        validityDays: 30,
        simType: "eSIM",
      },
    })
  );

  // Japan products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Nhật Bản - 5GB/7 ngày",
        description: "Gói eSIM Nhật Bản 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/japan.png"]',
        category: "Japan",
        categoryId: japan.id,
        price: 280000,
        finalPrice: 250000,
        discount: 11,
        featured: true,
        country: "Nhật Bản",
        region: "Châu Á",
        dataPlan: "5GB",
        validityDays: 7,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "SIM Nhật Bản - 15GB/30 ngày",
        description: "Gói SIM Nhật Bản 15GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/japan.png"]',
        category: "Japan",
        categoryId: japan.id,
        price: 520000,
        featured: false,
        country: "Nhật Bản",
        region: "Châu Á",
        dataPlan: "15GB",
        validityDays: 30,
        simType: "SIM",
      },
    })
  );

  // Korea products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Hàn Quốc - 8GB/10 ngày",
        description: "Gói eSIM Hàn Quốc 8GB data, hiệu lực 10 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/korea.png"]',
        category: "Korea",
        categoryId: korea.id,
        price: 300000,
        finalPrice: 270000,
        discount: 10,
        featured: true,
        country: "Hàn Quốc",
        region: "Châu Á",
        dataPlan: "8GB",
        validityDays: 10,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Hàn Quốc - 20GB/30 ngày",
        description: "Gói eSIM Hàn Quốc 20GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/korea.png"]',
        category: "Korea",
        categoryId: korea.id,
        price: 550000,
        featured: false,
        country: "Hàn Quốc",
        region: "Châu Á",
        dataPlan: "20GB",
        validityDays: 30,
        simType: "eSIM",
      },
    })
  );

  // Australia products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM Úc - 10GB/15 ngày",
        description: "Gói eSIM Úc 10GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/australia.png"]',
        category: "Australia",
        categoryId: australia.id,
        price: 400000,
        finalPrice: 360000,
        discount: 10,
        featured: true,
        country: "Úc",
        region: "Châu Đại Dương",
        dataPlan: "10GB",
        validityDays: 15,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "SIM Úc - 25GB/30 ngày",
        description: "Gói SIM Úc 25GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/australia.png"]',
        category: "Australia",
        categoryId: australia.id,
        price: 650000,
        featured: false,
        country: "Úc",
        region: "Châu Đại Dương",
        dataPlan: "25GB",
        validityDays: 30,
        simType: "SIM",
      },
    })
  );

  // Europe products
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM châu Âu - 5GB/7 ngày",
        description: "Gói eSIM châu Âu 5GB data, hiệu lực 7 ngày, hỗ trợ 4G/5G, sử dụng được ở 30+ nước",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/europe.png"]',
        category: "Europe",
        categoryId: europe.id,
        price: 250000,
        finalPrice: 220000,
        discount: 12,
        featured: true,
        country: "Châu Âu",
        region: "Châu Âu",
        dataPlan: "5GB",
        validityDays: 7,
        simType: "eSIM",
      },
    })
  );

  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM châu Âu - 20GB/30 ngày",
        description: "Gói eSIM châu Âu 20GB data, hiệu lực 30 ngày, hỗ trợ 4G/5G, sử dụng được ở 30+ nước",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/europe.png"]',
        category: "Europe",
        categoryId: europe.id,
        price: 650000,
        featured: false,
        country: "Châu Âu",
        region: "Châu Âu",
        dataPlan: "20GB",
        validityDays: 30,
        simType: "eSIM",
      },
    })
  );

  // Asia multi-country
  products.push(
    await prisma.product.create({
      data: {
        title: "eSIM châu Á - 8GB/15 ngày",
        description: "Gói eSIM châu Á 8GB data, hiệu lực 15 ngày, hỗ trợ 4G/5G, sử dụng được ở nhiều nước",
        imageURLs: '["https://kemal-web-storage.s3.eu-north-1.amazonaws.com/asia.png"]',
        category: "Asia",
        categoryId: asia.id,
        price: 300000,
        finalPrice: 270000,
        discount: 10,
        featured: true,
        country: "Châu Á",
        region: "Châu Á",
        dataPlan: "8GB",
        validityDays: 15,
        simType: "eSIM",
      },
    })
  );

  console.log(`✅ Created ${products.length} products with UUID IDs`);
  console.log("✅ Database seeded successfully with UUID format!");
  console.log(`   Countries: Thailand, Singapore, USA, Japan, Europe, Korea, Australia, Asia`);
  console.log(`   All IDs now use UUID format (e.g., ${products[0].id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
