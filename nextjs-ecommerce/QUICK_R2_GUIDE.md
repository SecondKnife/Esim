# 🚀 Hướng dẫn nhanh sử dụng Cloudflare R2

## ⚡ Setup nhanh trong 5 phút

### 1. Tạo R2 Bucket

```bash
# Đăng nhập Cloudflare Dashboard
# Vào R2 → Create bucket
# Tên bucket: esim-store-images (hoặc tên bạn muốn)
# Location: Automatic (hoặc chọn region gần bạn)
```

### 2. Cấu hình Public Access

```bash
# Trong bucket settings:
# Allow public access → Enable
# Copy Public bucket URL
# Ví dụ: https://pub-abc123.r2.dev
```

### 3. Tạo API Token

```bash
# R2 → Settings → API Tokens → Create API token
# Permissions: Object Read & Write
# Copy:
#   - Access Key ID
#   - Secret Access Key
```

### 4. Cập nhật .env

Thêm vào file `.env`:

```env
# Cloudflare R2
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-abc123.r2.dev"
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="esim-store-images"
```

### 5. Cài đặt dependencies

```bash
npm install @aws-sdk/client-s3
# hoặc
yarn add @aws-sdk/client-s3
```

### 6. Restart dev server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 📸 Sử dụng trong Admin

### Upload ảnh khi tạo/edit sản phẩm:

```tsx
import ImageUpload from "@/components/admin/image-upload";

// Trong form component:
const [imageUrls, setImageUrls] = useState<string[]>([]);

<ImageUpload
  value={imageUrls}
  onChange={setImageUrls}
  folder="products"
  maxFiles={5}
/>
```

### Lưu vào database:

```typescript
const imageURLsString = JSON.stringify(imageUrls);

await prisma.product.create({
  data: {
    // ... other fields
    imageURLs: imageURLsString,
  },
});
```

## 🖼️ Upload ảnh thủ công

### Cách 1: Qua Dashboard

1. Vào R2 bucket
2. Click "Upload"
3. Chọn file
4. Copy public URL
5. Sử dụng URL trong seed hoặc database

### Cách 2: Qua API

```typescript
// Example upload script
import { uploadToR2 } from './lib/r2';

const file = new File([blob], "image.jpg", { type: "image/jpeg" });
const url = await uploadToR2(file, "products");
console.log("Uploaded to:", url);
```

## 📦 Update Seed với R2

Cập nhật `prisma/seed.ts`:

```typescript
// Thay đổi từ:
imageURLs: '["https://old-storage.com/image.jpg"]'

// Thành:
imageURLs: JSON.stringify([
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/products/thailand-1.jpg`,
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/products/thailand-2.jpg`,
])
```

Sau đó chạy lại seed:

```bash
npm run prisma:seed
```

## 🎯 URL Structure

### Public URL format:
```
https://pub-abc123.r2.dev/products/image.jpg
https://pub-abc123.r2.dev/categories/thailand.png
https://pub-abc123.r2.dev/banners/main-banner.jpg
```

### Với custom domain:
```
https://cdn.yourdomain.com/products/image.jpg
```

## ✅ Checklist

- [ ] Tạo R2 bucket
- [ ] Enable public access
- [ ] Tạo API token
- [ ] Cập nhật .env
- [ ] Cập nhật next.config.js
- [ ] Cài đặt @aws-sdk/client-s3
- [ ] Upload ảnh test
- [ ] Verify ảnh hiển thị
- [ ] Update seed data
- [ ] Test upload từ admin

## 🔧 Troubleshooting

### Ảnh không hiển thị?

1. Check public access enabled
2. Check URL đúng format
3. Check next.config.js có domain R2
4. Clear browser cache

### Upload failed?

1. Check API credentials
2. Check bucket permissions
3. Check file size < 100MB
4. Check network connection

### CORS error?

Vào R2 bucket → Settings → CORS:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

## 💡 Tips

1. **Optimize images trước khi upload**
   - Dùng tools: TinyPNG, Squoosh
   - Recommended size: 1000x1000px
   - Format: WebP (best) hoặc JPG

2. **Naming convention**
   - products/product-{id}-{index}.jpg
   - categories/category-{name}.png
   - banners/banner-{type}.jpg

3. **Organize folders**
   ```
   /products/
   /categories/
   /banners/
   /thumbnails/
   ```

4. **Use WebP for better performance**
   - Nhẹ hơn 25-35% so với JPG
   - Supported by all modern browsers

## 📊 Cost Estimate

### R2 Pricing:
- Storage: $0.015/GB/month
- Class A operations (write): $4.50/million
- Class B operations (read): $0.36/million
- **Egress: FREE** 🎉

### Ví dụ:
- 10GB ảnh = $0.15/month
- 100K reads/month = FREE
- 1K writes/month = $0.0045

**So với S3: Tiết kiệm 70-90%** 💰

## 🚀 Next Steps

1. Setup custom domain (optional)
2. Enable image optimization với Cloudflare Images
3. Setup CDN caching rules
4. Implement image lazy loading
5. Add image compression pipeline

