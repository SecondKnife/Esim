/**
 * Script để upload hình ảnh eSIM lên Cloudflare R2
 * Chạy: npx tsx scripts/upload-esim-images.ts
 */

import { uploadToR2 } from '../lib/r2';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Placeholder image URLs (sử dụng Unsplash - ảnh chất lượng cao miễn phí)
const COUNTRY_IMAGES: { [key: string]: string } = {
  thailand: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  usa: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
  japan: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  korea: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80',
  australia: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
  'sing-malay': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'usa-canada': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
  'japan-korea': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
};

// Download image from URL
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
  const uint8Array = new Uint8Array(buffer);
  const blob = new Blob([uint8Array], { type: 'image/jpeg' });
  return new File([blob], filename, { type: 'image/jpeg' });
}

async function uploadCountryImages() {
  console.log('🚀 Bắt đầu upload hình ảnh eSIM lên R2...\n');

  const uploadedUrls: { [key: string]: string } = {};

  for (const [country, imageUrl] of Object.entries(COUNTRY_IMAGES)) {
    try {
      console.log(`📥 Đang download ảnh cho ${country}...`);
      const buffer = await downloadImage(imageUrl);

      console.log(`☁️  Đang upload ${country}.jpg lên R2...`);
      const file = bufferToFile(buffer, `${country}.jpg`);
      const r2Url = await uploadToR2(file, 'products');

      uploadedUrls[country] = r2Url;
      console.log(`✅ Upload thành công: ${r2Url}\n`);

      // Delay để tránh rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Lỗi khi upload ${country}:`, error);
    }
  }

  // Save URLs to JSON file
  const outputPath = path.join(__dirname, 'uploaded-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));

  console.log('\n✅ Hoàn thành upload tất cả hình ảnh!');
  console.log(`📁 URLs đã được lưu tại: ${outputPath}`);
  console.log('\n📋 Danh sách URLs:\n');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  return uploadedUrls;
}

// Main execution
uploadCountryImages()
  .then((urls) => {
    console.log('\n🎉 Upload hoàn tất!');
    console.log('\n📝 Tiếp theo:');
    console.log('1. Copy URLs từ uploaded-images.json');
    console.log('2. Cập nhật prisma/seed.ts với URLs mới');
    console.log('3. Chạy: npm run prisma:seed');
  })
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  });

