# 🚀 Hướng Dẫn Deploy Lên Vercel

## ✅ Điều Kiện Tiên Quyết

1. ✅ Code đã được push lên GitHub repository
2. ✅ Đã có tài khoản Vercel
3. ✅ Database PostgreSQL (Supabase) đã sẵn sàng
4. ✅ Cloudflare R2 đã được setup

## 📋 Các Bước Deploy

### 1. **Import Project vào Vercel**

- Truy cập: https://vercel.com/new
- Chọn repository GitHub của bạn
- Framework Preset: **Next.js** (auto-detect)
- Root Directory: `nextjs-ecommerce`

### 2. **Cấu Hình Environment Variables**

Trong Vercel Dashboard → Settings → Environment Variables, thêm các biến sau:

#### 🔐 **Database**
```
DATABASE_URL=postgresql://user:password@db.xxx.supabase.co:5432/postgres
```

#### 🔑 **Authentication**
```
JWT_SECRET=your-strong-secret-key-here
```

#### ☁️ **Cloudflare R2 (Image Storage)**
```
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

#### 💳 **Stripe (Optional - nếu sử dụng thanh toán)**
```
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

#### 🌍 **Build Settings**
```
NODE_ENV=production
NEXT_PHASE=phase-production-build
```

### 3. **Build Settings**

- **Build Command**: `npm run build` (mặc định)
- **Output Directory**: `.next` (mặc định)
- **Install Command**: `npm install` (mặc định)
- **Node Version**: 22.x

### 4. **Deploy**

Click **Deploy** và đợi Vercel build project!

## 🔧 Troubleshooting

### ❌ Lỗi: `MIDDLEWARE_INVOCATION_FAILED`

**Nguyên nhân**: Middleware có vấn đề trên Edge Runtime

**Giải pháp**: 
- ✅ Đã được sửa trong code mới nhất
- Middleware giờ có try-catch và error handling
- Skip API routes và static files

### ❌ Lỗi: `Can't reach database server`

**Nguyên nhân**: Database không accessible trong build time

**Giải pháp**: 
- ✅ Đã được sửa với `isBuildTime` check
- Database calls sẽ skip trong build time
- Chỉ chạy khi runtime

### ❌ Lỗi: Build fails

**Kiểm tra**:
1. Tất cả environment variables đã được set chưa?
2. `DATABASE_URL` đúng format PostgreSQL chưa?
3. Supabase database có accessible từ internet không?

## 📊 Sau Khi Deploy

### 1. **Kiểm tra Database Connection**

Truy cập: `https://your-app.vercel.app/`

Nếu thấy data → ✅ Database connected
Nếu trang trống → ❌ Kiểm tra DATABASE_URL

### 2. **Tạo Admin User**

Chạy seed script để tạo admin:

```bash
# Trong Vercel Dashboard → Settings → Functions
# Hoặc kết nối database trực tiếp và chạy:
npx prisma db seed
```

Hoặc tạo admin thủ công trong Supabase dashboard.

### 3. **Test Authentication**

- Truy cập: `https://your-app.vercel.app/login`
- Login với admin account
- Thử truy cập `/admin`

### 4. **Upload Images**

Nếu chưa có images trong R2:

```bash
# Local machine
npm run upload-images
```

## 🎯 Checklist Deploy Thành Công

- ✅ Website load được
- ✅ Products hiển thị (có data từ database)
- ✅ Login/Signup hoạt động
- ✅ Admin panel accessible
- ✅ Images hiển thị từ R2
- ✅ Session 7 ngày hoạt động
- ✅ Middleware redirect đúng

## 🔄 Redeploy

Mỗi khi push code mới lên GitHub:
- Vercel tự động detect và redeploy
- Không cần làm gì thêm

## 📱 Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records theo hướng dẫn
4. Đợi SSL certificate được issue (tự động)

## 🆘 Support

Nếu gặp vấn đề:
1. Check Vercel deployment logs
2. Check Vercel Function logs
3. Check Supabase logs
4. Verify tất cả environment variables

---

**Chúc bạn deploy thành công! 🎉**

