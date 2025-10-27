# Hướng dẫn sử dụng Cloudflare R2 cho ảnh sản phẩm

## 📋 Yêu cầu

1. Tài khoản Cloudflare
2. R2 Bucket đã được tạo
3. R2 Public URL hoặc Custom Domain

## 🔧 Bước 1: Cập nhật file .env

Thêm các biến môi trường sau vào file `.env`:

```env
# Cloudflare R2 Configuration
NEXT_PUBLIC_R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"
# Hoặc nếu bạn đã setup custom domain:
# NEXT_PUBLIC_R2_PUBLIC_URL="https://cdn.yourdomain.com"

# R2 Access Credentials (cho upload từ admin)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
```

### Lấy thông tin R2:

1. **Account ID**: 
   - Đăng nhập Cloudflare Dashboard
   - Click vào account bên phải góc trên
   - Copy Account ID

2. **Access Key & Secret**:
   - Vào R2 → Settings → API Tokens
   - Click "Create API token"
   - Chọn quyền "Object Read & Write"
   - Copy Access Key ID và Secret Access Key

3. **Bucket Name**: Tên bucket bạn đã tạo

4. **Public URL**:
   - Vào R2 bucket → Settings
   - Trong "Public access" section, copy URL
   - Hoặc setup custom domain nếu có

## 🖼️ Bước 2: Cấu hình Next.js Image Domains

Cập nhật `next.config.js` để cho phép load ảnh từ R2:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yourdomain.com', // Nếu dùng custom domain
      },
    ],
  },
}

module.exports = nextConfig
```

## 📁 Bước 3: Cấu trúc thư mục trong R2

Khuyến nghị cấu trúc:

```
your-bucket/
├── products/
│   ├── product_1.jpg
│   ├── product_2.jpg
│   └── ...
├── categories/
│   ├── thailand.png
│   ├── singapore.png
│   └── ...
└── banners/
    └── banner-main.jpg
```

## 💾 Bước 4: Upload ảnh lên R2

### Cách 1: Upload qua Cloudflare Dashboard
1. Vào R2 bucket
2. Click "Upload"
3. Chọn file hoặc kéo thả

### Cách 2: Upload qua API (từ Admin Panel)

File `lib/r2.ts` đã được tạo để upload ảnh:

```typescript
import { uploadToR2 } from '@/lib/r2';

// Trong admin form:
const file = event.target.files[0];
const url = await uploadToR2(file, 'products');
// url = "https://your-bucket.r2.cloudflarestorage.com/products/filename.jpg"
```

## 🔗 Bước 5: Cập nhật imageURLs trong Database

### Cách 1: Sử dụng full URL

```javascript
// Trong seed.ts hoặc admin form:
imageURLs: JSON.stringify([
  "https://your-bucket.r2.cloudflarestorage.com/products/thailand-esim-1.jpg",
  "https://your-bucket.r2.cloudflarestorage.com/products/thailand-esim-2.jpg"
])
```

### Cách 2: Chỉ lưu path (khuyến nghị)

Lưu path trong database:
```javascript
imageURLs: JSON.stringify([
  "/products/thailand-esim-1.jpg",
  "/products/thailand-esim-2.jpg"
])
```

Sau đó thêm base URL khi hiển thị:
```typescript
// Trong component:
const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const fullImageUrl = `${baseUrl}${imagePath}`;
```

## 🎨 Bước 6: Update Seed Data

Cập nhật `prisma/seed.ts` với URL R2 của bạn:

```typescript
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://your-bucket.r2.cloudflarestorage.com";

const products = [
  {
    title: "eSIM Thailand - 8GB/30 days",
    imageURLs: JSON.stringify([
      `${R2_BASE_URL}/products/thailand-esim-1.jpg`,
      `${R2_BASE_URL}/products/thailand-esim-2.jpg`
    ]),
    // ...
  }
];
```

## 🚀 Bước 7: Test

1. Upload một ảnh test lên R2
2. Copy URL công khai
3. Thêm vào một sản phẩm trong database
4. Kiểm tra xem ảnh có hiển thị không

## 📊 Lợi ích của R2

✅ **Chi phí thấp**: $0.015/GB/tháng (rẻ hơn S3)
✅ **Không phí egress**: Miễn phí bandwidth
✅ **Tốc độ nhanh**: CDN tích hợp sẵn
✅ **Tương thích S3**: Có thể dùng SDK của AWS S3

## 🔒 Bảo mật

### Public Access:
- Cho phép public read để hiển thị ảnh
- Không cho phép public write

### CORS Configuration (nếu upload từ browser):
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

## 🔄 Migration từ S3/Storage khác

Nếu đang dùng S3 hoặc storage khác, chỉ cần:

1. Upload ảnh lên R2 (có thể dùng rclone)
2. Update `NEXT_PUBLIC_R2_PUBLIC_URL` trong .env
3. Chạy lại seed hoặc update database

## 📝 Ghi chú

- R2 tương thích 100% với S3 API
- Có thể dùng AWS SDK với R2
- Hỗ trợ image optimization qua Workers
- Có thể setup Image Resizing với Cloudflare Images

## 🆘 Troubleshooting

### Ảnh không hiển thị:
1. Kiểm tra bucket có public access
2. Kiểm tra CORS configuration
3. Kiểm tra URL trong imageURLs có đúng không
4. Kiểm tra Next.js image domains config

### Lỗi CORS:
- Cấu hình CORS trong R2 bucket settings
- Thêm domain vào AllowedOrigins

### Upload failed:
- Kiểm tra API credentials
- Kiểm tra bucket permissions
- Kiểm tra file size limits

