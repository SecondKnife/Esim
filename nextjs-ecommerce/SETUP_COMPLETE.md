# 🎉 Setup Hoàn Tất!

## ✅ Những gì đã thực hiện

### 1. **Cấu hình R2 Image Storage**
- ✅ Cập nhật tất cả components để sử dụng R2
- ✅ `ImageUpload` component - Upload ảnh lên Cloudflare R2
- ✅ API `/api/upload` - Handle upload từ admin
- ✅ `add-product.tsx` - Tạo sản phẩm mới với R2 URLs
- ✅ `edit-form.tsx` - Edit sản phẩm và upload ảnh mới

### 2. **Database Seeding**
- ✅ **19 sản phẩm eSIM** đã được seed
- ✅ **8 categories**: Thailand, Singapore, USA, Japan, Europe, Korea, Australia, Asia
- ✅ Dữ liệu đầy đủ: giá, discount, data plans, validity days
- ✅ Placeholder images từ Unsplash (chất lượng cao)

### 3. **Dependencies Fixed**
- ✅ Cài đặt với `--legacy-peer-deps` (Material-UI v4 vs React 18 conflict)
- ✅ Tạo file `.npmrc` để tự động apply legacy-peer-deps
- ✅ Prisma Client đã được generate

### 4. **Documentation**
- ✅ `R2_SETUP_GUIDE.md` - Hướng dẫn setup R2 chi tiết
- ✅ `TROUBLESHOOTING.md` - Giải quyết các lỗi thường gặp
- ✅ `.env.example` - Template cho environment variables

---

## 🚀 Chạy Dự Án

### Server đang chạy tại:
```
http://localhost:3000
```

### Các trang quan trọng:

1. **Homepage/Store**
   - URL: http://localhost:3000
   - Hiển thị sản phẩm, filter, search, cart

2. **Admin Panel**
   - URL: http://localhost:3000/admin
   - Quản lý sản phẩm, categories, orders

3. **Products Management**
   - URL: http://localhost:3000/admin/products
   - Xem, thêm, sửa, xóa sản phẩm

4. **Create Product**
   - URL: http://localhost:3000/admin/products/new
   - Upload ảnh lên R2, tạo sản phẩm mới

---

## 🔐 Tạo Admin Account

Bạn cần tạo admin user để đăng nhập Admin Panel:

### Cách 1: Qua Signup + Script
```bash
# 1. Truy cập
http://localhost:3000/signup

# 2. Đăng ký tài khoản

# 3. Chạy script (thay your-email@example.com)
npx tsx lib/create-admin.ts your-email@example.com
```

### Cách 2: Seed trực tiếp vào DB (Nhanh hơn)

Tạo file `prisma/seed-admin.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.create({
    data: {
      id: "admin_1",
      name: "Admin User",
      email: "admin@esim.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created!");
  console.log("   Email: admin@esim.com");
  console.log("   Password: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Sau đó chạy:
```bash
npx tsx prisma/seed-admin.ts
```

---

## 📸 Upload Ảnh lên R2

### Hiện tại:
- Sản phẩm đang dùng **placeholder images** từ Unsplash
- Ảnh đẹp và chất lượng cao, nhưng chỉ là demo

### Để upload ảnh thật:

#### Option 1: Qua Admin Panel (Khuyến nghị)
1. Đăng nhập Admin
2. Vào **Products** → Click sản phẩm
3. Upload ảnh mới qua **ImageUpload** component
4. Ảnh sẽ tự động upload lên R2
5. Save - URL được update trong database

#### Option 2: Upload hàng loạt qua Script
1. Cấu hình đầy đủ R2 credentials trong `.env`:
```env
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket-name"  ← QUAN TRỌNG!
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

2. Chạy script:
```bash
npx tsx scripts/upload-esim-images.ts
```

---

## 📦 Sản Phẩm Đã Seed

### Thailand (4 sản phẩm)
- eSIM 3GB/7 ngày - 75,000đ (Sale 12%)
- eSIM 8GB/15 ngày - 120,000đ
- eSIM 15GB/30 ngày - 160,000đ (Sale 11%)
- eSIM Unlimited/7 ngày - 150,000đ

### Singapore (3 sản phẩm)
- eSIM 5GB/7 ngày - 120,000đ
- eSIM 10GB/14 ngày - 180,000đ
- eSIM Unlimited/30 ngày - 350,000đ

### USA (3 sản phẩm)
- eSIM 5GB/7 ngày - 180,000đ
- eSIM 15GB/15 ngày - 280,000đ
- eSIM 20GB/30 ngày - 400,000đ (Sale 11%)

### Japan (3 sản phẩm)
- eSIM 5GB/7 ngày - 280,000đ
- eSIM 10GB/14 ngày - 420,000đ
- eSIM 20GB/30 ngày - 500,000đ (Sale 9%)

### Europe (2 sản phẩm)
- eSIM 5GB/7 ngày - 200,000đ
- eSIM 30GB/30 ngày - 500,000đ (Sale 9%)

### Korea (2 sản phẩm)
- eSIM 5GB/7 ngày - 180,000đ
- eSIM 20GB/30 ngày - 430,000đ (Sale 10%)

### Australia (2 sản phẩm)
- eSIM 5GB/7 ngày - 220,000đ
- eSIM 25GB/30 ngày - 470,000đ (Sale 10%)

---

## 🛠️ Lệnh Hữu Ích

### Development
```bash
npm run dev              # Chạy dev server
npm run build            # Build production
npm run start            # Chạy production server
npm run lint             # Check linting
```

### Database
```bash
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio (GUI)
npx tsx prisma/seed-simple.ts  # Seed lại data
```

### R2 & Images
```bash
npx tsx scripts/upload-esim-images.ts    # Upload ảnh lên R2
```

### Troubleshooting
```bash
# Clear cache và rebuild
rm -rf .next
npm run dev

# Clean install
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

---

## 📁 Cấu Trúc Files Quan Trọng

```
nextjs-ecommerce/
├── app/
│   ├── (admin)/admin/           # Admin Panel
│   │   ├── products/            # Product management
│   │   │   ├── new/             # Create product
│   │   │   └── _components/     # Edit forms
│   ├── (routes)/                # Public routes
│   │   ├── shop/                # Shop page
│   │   ├── cart/                # Cart
│   │   └── product/[id]/        # Product detail
│   └── api/
│       ├── product/             # Product API
│       └── upload/              # R2 Upload API
├── components/
│   └── admin/
│       └── image-upload.tsx     # R2 Upload Component
├── lib/
│   ├── r2.ts                    # R2 utilities
│   └── r2-urls.ts               # URL helpers
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed-simple.ts           # Seed script
└── scripts/
    ├── upload-esim-images.ts    # Upload helper
    └── seed-with-r2.ts          # R2 seed script
```

---

## 🔧 Environment Variables Cần Thiết

File `.env`:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/esim"

# Auth
JWT_SECRET="your-secret-key"

# App URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
FRONTEND_STORE_URL="http://localhost:3000"

# Cloudflare R2 (Optional - cho upload qua Admin)
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-xxx.r2.dev"
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket-name"
```

---

## 🎯 Tiếp Theo Làm Gì?

### 1. **Tạo Admin Account** (Bắt buộc)
- Chạy seed admin script hoặc signup + promote

### 2. **Kiểm tra Store**
- Truy cập http://localhost:3000
- Xem danh sách sản phẩm
- Test filter, search, cart

### 3. **Kiểm tra Admin Panel**
- Login vào admin
- Test create/edit product
- Upload ảnh lên R2

### 4. **Customize**
- Thay đổi logo, colors
- Thêm sản phẩm mới
- Cấu hình payment gateway (Stripe, PayPal)

### 5. **Deploy**
- Đọc `DEPLOY.md` để deploy lên Netlify/Vercel
- Setup production R2 bucket
- Cấu hình domain

---

## 📚 Tài Liệu

- `R2_SETUP_GUIDE.md` - Setup Cloudflare R2 chi tiết
- `TROUBLESHOOTING.md` - Giải quyết lỗi
- `DEPLOY.md` - Hướng dẫn deploy
- `README.md` - Overview dự án

---

## ❓ Cần Giúp?

Nếu gặp vấn đề:
1. Check `TROUBLESHOOTING.md`
2. Xem logs trong terminal
3. Check `.env` file
4. Clear cache: `rm -rf .next && npm run dev`

---

🎉 **Chúc mừng! Dự án đã sẵn sàng!**

