/**
 * Script upload ảnh categories lên R2
 * Chạy: npx tsx scripts/upload-category-images.ts
 */

import { uploadToR2 } from '../lib/r2';
import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();

// Unsplash images cho categories
const CATEGORY_IMAGES: { [key: string]: string } = {
  'billboard_thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
  'billboard_singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'billboard_usa': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
  'billboard_japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'billboard_europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  'billboard_korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80',
  'billboard_australia': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
  'billboard_asia': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
};

// Download image từ URL
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
  });
}

// Convert Buffer to File
function bufferToFile(buffer: Buffer, filename: string): File {
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  return new File([blob], filename, { type: 'image/jpeg' });
}

async function uploadCategoryImages() {
  console.log('🚀 Bắt đầu upload ảnh categories lên R2...\n');

  for (const [billboardId, imageUrl] of Object.entries(CATEGORY_IMAGES)) {
    try {
      console.log(`📥 Downloading ảnh cho ${billboardId}...`);
      const buffer = await downloadImage(imageUrl);

      const filename = `${billboardId.replace('billboard_', '')}.jpg`;
      console.log(`☁️  Uploading ${filename} lên R2...`);
      
      const file = bufferToFile(buffer, filename);
      const r2Url = await uploadToR2(file, 'categories');

      // Update billboard trong database
      await prisma.billboard.update({
        where: { id: billboardId },
        data: { imageURL: r2Url },
      });

      console.log(`✅ Upload thành công: ${r2Url}\n`);

      // Delay để tránh rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Lỗi khi upload ${billboardId}:`, error);
    }
  }

  console.log('\n🎉 Hoàn thành upload tất cả ảnh categories!');
  console.log('\n📝 Billboards đã được update với R2 URLs trong database');
  console.log('Refresh trang để xem ảnh mới!');
}

// Main execution
uploadCategoryImages()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

