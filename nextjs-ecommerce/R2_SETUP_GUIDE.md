# Hướng dẫn cấu hình Cloudflare R2 cho dự án E-Commerce

## 📝 Tổng quan

Dự án này đã được cập nhật để lưu trữ hình ảnh sản phẩm trên **Cloudflare R2** thay vì lưu dưới dạng base64 trong database. Điều này giúp:

✅ **Tối ưu hiệu suất**: Giảm kích thước database, tăng tốc độ query  
✅ **Tiết kiệm chi phí**: R2 không tính phí bandwidth  
✅ **Quản lý tốt hơn**: Dễ dàng backup, migrate hình ảnh  
✅ **Scale tốt hơn**: Không lo giới hạn kích thước database  

## 🚀 Bước 1: Tạo Cloudflare R2 Bucket

### 1.1. Đăng ký Cloudflare (nếu chưa có)
- Truy cập: https://dash.cloudflare.com/sign-up
- Đăng ký tài khoản miễn phí

### 1.2. Tạo R2 Bucket
1. Đăng nhập vào Cloudflare Dashboard
2. Vào **R2** từ menu bên trái
3. Click **Create bucket**
4. Nhập tên bucket (ví dụ: `esim-images`)
5. Chọn location (mặc định là Auto)
6. Click **Create bucket**

### 1.3. Cấu hình Public Access
1. Vào bucket vừa tạo
2. Chọn tab **Settings**
3. Tìm mục **Public access**
4. Click **Allow Access** để bucket có thể truy cập công khai
5. Copy **Public R2.dev subdomain** (dạng: `https://pub-xxxxxxxxxx.r2.dev`)

## 🔑 Bước 2: Tạo API Token

### 2.1. Tạo API Token cho Upload
1. Trong R2 Dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Đặt tên token (ví dụ: `esim-upload-token`)
4. Chọn permissions: **Object Read & Write**
5. Optional: Giới hạn token chỉ cho bucket cụ thể
6. Click **Create API Token**

### 2.2. Lưu thông tin Token
**⚠️ QUAN TRỌNG**: Copy và lưu các thông tin sau ngay lập tức (chỉ hiển thị 1 lần):
- **Access Key ID**
- **Secret Access Key**
- **Endpoint URL** (để lấy Account ID)

Account ID nằm trong Endpoint URL:
```
https://[ACCOUNT_ID].r2.cloudflarestorage.com
```

## ⚙️ Bước 3: Cấu hình Environment Variables

### 3.1. Tạo/Cập nhật file `.env`

Trong thư mục `nextjs-ecommerce`, tạo file `.env` với nội dung:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"

# App URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
FRONTEND_STORE_URL="http://localhost:3000"

# ============================================
# Cloudflare R2 Configuration
# ============================================

# Public URL (từ Public R2.dev subdomain)
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-xxxxxxxxxx.r2.dev"

# R2 Credentials (từ API Token)
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="esim-images"
```

### 3.2. Thay thế các giá trị

- `NEXT_PUBLIC_R2_PUBLIC_URL`: Public R2.dev subdomain từ bước 1.3
- `R2_ACCOUNT_ID`: Account ID từ endpoint URL
- `R2_ACCESS_KEY_ID`: Access Key ID từ bước 2.2
- `R2_SECRET_ACCESS_KEY`: Secret Access Key từ bước 2.2
- `R2_BUCKET_NAME`: Tên bucket của bạn

## 📁 Bước 4: Cấu trúc thư mục trong R2

Dự án tự động tạo cấu trúc thư mục khi upload:

```
your-bucket/
├── products/           # Hình ảnh sản phẩm
│   ├── 1704123456789-esim-thailand.jpg
│   ├── 1704123457890-esim-singapore.jpg
│   └── ...
├── categories/         # Hình ảnh category/billboard (nếu cần)
│   └── ...
└── banners/           # Banner images (nếu cần)
    └── ...
```

## 🧪 Bước 5: Test cấu hình

### 5.1. Kiểm tra kết nối

Tạo file test tạm thời `test-r2.ts`:

```typescript
import { uploadToR2 } from './lib/r2';

// Test với một file ảnh nhỏ
async function testR2Upload() {
  // Tạo một file giả để test
  const blob = new Blob(['test'], { type: 'image/jpeg' });
  const testFile = new File([blob], 'test.jpg', { type: 'image/jpeg' });
  
  try {
    const url = await uploadToR2(testFile, 'test');
    console.log('✅ R2 Upload successful:', url);
  } catch (error) {
    console.error('❌ R2 Upload failed:', error);
  }
}

testR2Upload();
```

### 5.2. Test qua Admin Panel

1. Chạy dự án: `npm run dev`
2. Đăng nhập vào Admin Panel
3. Vào **Products** → **Create Product**
4. Upload một hình ảnh
5. Kiểm tra:
   - Upload thành công?
   - URL hiển thị đúng định dạng R2?
   - Ảnh hiển thị được trên trang product?

## 🔧 Bước 6: Cấu hình CORS (nếu cần)

Nếu bạn upload trực tiếp từ browser (presigned URLs), cần cấu hình CORS:

1. Vào R2 bucket → **Settings** → **CORS Policy**
2. Thêm policy:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

## 🌐 Bước 7: Custom Domain (Optional)

### 7.1. Tại sao cần Custom Domain?

- URL đẹp hơn: `cdn.yourdomain.com` thay vì `pub-xxx.r2.dev`
- Branding tốt hơn
- Có thể dùng Cloudflare Images Optimization

### 7.2. Cách setup

1. Vào R2 bucket → **Settings** → **Custom Domains**
2. Click **Connect Domain**
3. Nhập subdomain (ví dụ: `cdn.yourdomain.com`)
4. Cloudflare tự động tạo DNS record
5. Cập nhật `.env`:
```env
NEXT_PUBLIC_R2_PUBLIC_URL="https://cdn.yourdomain.com"
```

## 📤 Bước 8: Deploy lên Production

### 8.1. Netlify

Nếu deploy lên Netlify:

1. Vào Netlify Dashboard → Site Settings → Environment Variables
2. Thêm tất cả biến môi trường từ file `.env`
3. Redeploy site

### 8.2. Vercel

1. Vào Vercel Dashboard → Settings → Environment Variables
2. Thêm variables
3. Redeploy

### 8.3. Lưu ý Production

- ✅ Đảm bảo `NEXT_PUBLIC_R2_PUBLIC_URL` là production URL
- ✅ Cập nhật CORS với domain production
- ✅ Không commit file `.env` vào Git
- ✅ Backup API credentials ở nơi an toàn

## 🛠️ Cách sử dụng trong code

### Upload ảnh khi tạo sản phẩm:

```typescript
import ImageUpload from "@/components/admin/image-upload";

// Trong component:
const [imageURLs, setImageURLs] = useState<string[]>([]);

<ImageUpload
  value={imageURLs}
  onChange={setImageURLs}
  folder="products"
  maxFiles={5}
/>
```

Component `ImageUpload` tự động:
- Upload lên R2 qua API `/api/upload`
- Trả về array của public URLs
- Lưu URLs này vào database

### Hiển thị ảnh:

```tsx
import Image from "next/image";

<Image
  src={imageURL}
  alt="Product"
  width={500}
  height={500}
/>
```

Next.js Image component tự động optimize và cache ảnh.

## 🐛 Troubleshooting

### Lỗi: "Unauthorized" khi upload

**Nguyên nhân**: API credentials sai hoặc token hết hạn

**Giải pháp**:
1. Kiểm tra lại `R2_ACCESS_KEY_ID` và `R2_SECRET_ACCESS_KEY`
2. Tạo token mới nếu cần
3. Restart dev server sau khi update `.env`

### Lỗi: "Bucket not found"

**Nguyên nhân**: `R2_BUCKET_NAME` sai

**Giải pháp**:
1. Kiểm tra tên bucket trong Cloudflare Dashboard
2. Cập nhật `.env`
3. Restart server

### Ảnh không hiển thị (404)

**Nguyên nhân**: 
- Public access chưa được bật
- URL không đúng

**Giải pháp**:
1. Kiểm tra Public Access trong bucket settings
2. Kiểm tra `NEXT_PUBLIC_R2_PUBLIC_URL` có đúng không
3. Test truy cập URL trực tiếp trên browser

### Lỗi: "Image optimization failed"

**Nguyên nhân**: Next.js không thể tối ưu ảnh từ domain chưa được whitelist

**Giải pháp**:
File `next.config.js` đã được cấu hình sẵn:
```javascript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.r2.cloudflarestorage.com",
    },
    {
      protocol: "https",
      hostname: "**.r2.dev",
    },
  ],
}
```

Nếu dùng custom domain, thêm:
```javascript
{
  protocol: "https",
  hostname: "cdn.yourdomain.com",
}
```

### Upload chậm

**Nguyên nhân**: 
- File size lớn
- Kết nối mạng chậm
- Cloudflare location xa

**Giải pháp**:
1. Resize ảnh trước khi upload (khuyến nghị max 2MB)
2. Sử dụng image compression
3. Thêm loading indicator cho UX tốt hơn

## 💰 Chi phí R2

### Free Tier (miễn phí mãi mãi):
- ✅ 10GB storage/tháng
- ✅ 1 triệu Class A operations (PUT, POST, LIST)
- ✅ 10 triệu Class B operations (GET, HEAD)
- ✅ **Unlimited bandwidth** (miễn phí hoàn toàn!)

### Paid (nếu vượt free tier):
- 💵 $0.015/GB/tháng cho storage
- 💵 $4.50/triệu Class A operations
- 💵 $0.36/triệu Class B operations

**Ví dụ**: 
- 1000 sản phẩm
- Mỗi sản phẩm 5 ảnh
- Mỗi ảnh ~500KB
- Total: ~2.5GB storage
- **Chi phí**: Miễn phí (trong free tier)

## 📚 Tài liệu tham khảo

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [AWS S3 SDK (R2 compatible)](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

## ✅ Checklist hoàn thành

- [ ] Tạo Cloudflare R2 bucket
- [ ] Bật Public Access
- [ ] Tạo API Token
- [ ] Cấu hình `.env` với đầy đủ credentials
- [ ] Test upload qua Admin Panel
- [ ] Kiểm tra ảnh hiển thị đúng
- [ ] Setup CORS (nếu cần)
- [ ] Cấu hình Custom Domain (optional)
- [ ] Deploy lên production với env variables

---

🎉 **Hoàn thành!** Bạn đã setup thành công Cloudflare R2 cho dự án E-Commerce.

Nếu có vấn đề, vui lòng kiểm tra lại từng bước hoặc tham khảo phần Troubleshooting.

