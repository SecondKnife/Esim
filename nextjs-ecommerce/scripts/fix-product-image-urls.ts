/**
 * Cập nhật lại imageURLs của Product sang link R2 đã upload
 * Chạy: npx tsx -r dotenv/config scripts/fix-product-image-urls.ts
 */

import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

type UrlMap = Record<string, string>;

async function main() {
  console.log('🔧 Bắt đầu cập nhật imageURLs sản phẩm sang R2...');

  // Đọc mapping các URL đã upload từ upload-esim-images.ts
  const mapPath = path.join(__dirname, 'uploaded-images.json');
  if (!fs.existsSync(mapPath)) {
    throw new Error('Không tìm thấy scripts/uploaded-images.json. Hãy chạy upload-esim-images.ts trước.');
  }
  const uploaded: UrlMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

  // Mapping theo category → filename key trong uploaded-images.json
  const categoryToKey: Record<string, string> = {
    thailand: 'thailand',
    singapore: 'singapore',
    usa: 'usa',
    japan: 'japan',
    europe: 'europe',
    korea: 'korea',
    australia: 'australia',
  };

  // Lấy tất cả products
  const products = await prisma.product.findMany();
  console.log(`📦 Tìm thấy ${products.length} sản phẩm`);

  let updated = 0;
  for (const p of products) {
    const key = categoryToKey[p.category.toLowerCase()];
    const url = key ? uploaded[key] : undefined;
    if (!url) {
      console.warn(`⚠️  Bỏ qua (không có URL cho category): id=${p.id}, category=${p.category}`);
      continue;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: { imageURLs: JSON.stringify([url]) },
    });
    updated++;
  }

  console.log(`✅ Đã cập nhật ${updated}/${products.length} sản phẩm`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


