# ✅ Cloudflare R2 Integration Success!

## 🎉 Đã hoàn thành

### ✅ Kết nối R2 thành công
- **Bucket**: esim-bucket
- **Public URL**: https://pub-e0e9acaddce04acebe10f6c2f0d53bb3.r2.dev
- **Status**: ✅ Connected & Working

### ✅ Ảnh Banner đã được thay thế
- **File**: BannerMain.jpg (61.24 KB)
- **Location**: banners/BannerMain.jpg
- **Public URL**: https://pub-e0e9acaddce04acebe10f6c2f0d53bb3.r2.dev/banners/BannerMain.jpg
- **Used in**: `components/ui/billboard.tsx`

### ✅ Files đã tạo

1. **Helper Functions**
   - `lib/r2.ts` - Upload/delete functions
   - `lib/r2-urls.ts` - URL management helper
   - `app/api/upload/route.ts` - Upload API endpoint
   - `components/admin/image-upload.tsx` - Admin upload component

2. **Test Scripts**
   - `test-r2-connection.js` - Test connection & upload
   - `list-r2-images.js` - List all images in bucket

3. **Documentation**
   - `R2_SETUP.md` - Detailed setup guide
   - `QUICK_R2_GUIDE.md` - Quick start guide

## 📸 Ảnh hiện tại trong R2

### banners/
- ✅ BannerMain.jpg (61.24 KB)
  - URL: https://pub-e0e9acaddce04acebe10f6c2f0d53bb3.r2.dev/banners/BannerMain.jpg

## 🚀 Cách sử dụng

### 1. Thay thế ảnh trong code

**Cách 1: Sử dụng R2_IMAGES helper**
```typescript
import { R2_IMAGES } from "@/lib/r2-urls";

// Trong component:
const imageUrl = R2_IMAGES.BANNER_MAIN;
```

**Cách 2: Sử dụng getR2Url function**
```typescript
import { getR2Url } from "@/lib/r2-urls";

const imageUrl = getR2Url("banners/BannerMain.jpg");
```

**Cách 3: Direct URL**
```typescript
const imageUrl = "https://pub-e0e9acaddce04acebe10f6c2f0d53bb3.r2.dev/banners/BannerMain.jpg";
```

### 2. Upload ảnh mới lên R2

**Cách 1: Qua Cloudflare Dashboard**
```
1. Đăng nhập Cloudflare
2. Vào R2 → esim-bucket
3. Click Upload
4. Chọn folder (products, categories, banners)
5. Upload file
6. Copy public URL
```

**Cách 2: Qua script**
```bash
# Edit test-r2-connection.js với ảnh mới
node test-r2-connection.js
```

**Cách 3: Qua Admin Panel (coming soon)**
```typescript
import ImageUpload from "@/components/admin/image-upload";

<ImageUpload
  value={imageUrls}
  onChange={setImageUrls}
  folder="products"
/>
```

### 3. Update seed data với R2

```typescript
// prisma/seed.ts
import { getR2Url } from "../lib/r2-urls";

const products = [
  {
    title: "eSIM Thailand",
    imageURLs: JSON.stringify([
      getR2Url("products/thailand-1.jpg"),
      getR2Url("products/thailand-2.jpg"),
    ]),
  }
];
```

## 📋 Cấu trúc thư mục khuyến nghị

```
esim-bucket/
├── banners/
│   ├── BannerMain.jpg ✅
│   ├── hero-banner.jpg
│   └── promo-banner.jpg
├── categories/
│   ├── thailand.png
│   ├── singapore.png
│   ├── usa.png
│   ├── japan.png
│   ├── korea.png
│   ├── europe.png
│   └── australia.png
├── products/
│   ├── product_1_0.jpg
│   ├── product_1_1.jpg
│   ├── product_2_0.jpg
│   └── ...
└── placeholders/
    └── default.png
```

## 🛠️ Scripts có sẵn

### Test connection
```bash
node test-r2-connection.js
```
- ✅ Test kết nối R2
- ✅ Upload BannerMain.jpg
- ✅ Hiển thị public URL

### List tất cả ảnh
```bash
node list-r2-images.js
```
- ✅ List tất cả files trong bucket
- ✅ Group theo folder
- ✅ Generate JSON config

## 🎯 Next Steps

### 1. Upload ảnh categories (khuyến nghị)
```bash
# Upload các ảnh sau lên folder categories/:
- thailand.png
- singapore.png
- usa.png
- japan.png
- korea.png
- europe.png
- australia.png
```

### 2. Upload ảnh products
```bash
# Upload ảnh sản phẩm vào folder products/:
- product_1_0.jpg (ảnh chính)
- product_1_1.jpg (ảnh phụ)
- product_2_0.jpg
- ...
```

### 3. Update seed.ts
```bash
# Sau khi upload xong, update seed.ts với R2 URLs
npm run prisma:seed
```

### 4. Integrate với Admin Panel
```bash
# Thêm ImageUpload component vào edit-product form
# File: app/(admin)/admin/products/_components/edit-form.tsx
```

## 💡 Tips

1. **Tên file nên rõ ràng**
   - ✅ thailand-esim-8gb.jpg
   - ❌ image123.jpg

2. **Organize theo folder**
   - banners/ - Cho hero sections
   - categories/ - Cho category cards
   - products/ - Cho product images

3. **Optimize images trước khi upload**
   - Dùng TinyPNG, Squoosh
   - Recommended: 1000x1000px
   - Format: WebP hoặc JPG

4. **Naming convention**
   - products: `product_{id}_{index}.jpg`
   - categories: `{country-name}.png`
   - banners: `{banner-type}.jpg`

## 📊 Cost (Current Usage)

- Storage: ~0.06 MB ≈ $0.000001/month
- Operations: ~10 requests = FREE
- **Total: ~$0/month** 🎉

## ✅ Verification

### Trang hiện đang dùng R2:
- ✅ **Billboard Banner** - BannerMain.jpg từ R2
- 🔄 **Categories** - Đang dùng S3 (cần upload lên R2)
- 🔄 **Products** - Đang dùng S3 (cần upload lên R2)

### Test URLs:
```bash
# Banner (✅ Working)
https://pub-e0e9acaddce04acebe10f6c2f0d53bb3.r2.dev/banners/BannerMain.jpg

# Homepage
http://localhost:3000

# Refresh browser để thấy ảnh mới từ R2
```

## 🎉 Kết luận

R2 đã được tích hợp thành công! Bạn có thể:
- ✅ Upload ảnh lên R2
- ✅ Sử dụng ảnh từ R2 trong code
- ✅ Quản lý ảnh qua helper functions
- ✅ Upload via scripts hoặc dashboard

**Next**: Upload thêm ảnh categories và products, sau đó update seed.ts!

