# ✅ Checklist Deploy Vercel - Nhanh Gọn

## 🔥 Trước Khi Deploy

- [ ] Code đã commit và push lên GitHub
- [ ] Đã xóa các file sensitive (.env không được commit)
- [ ] Build local thành công: `npm run build`
- [ ] Database PostgreSQL/Supabase đã sẵn sàng

## 🚀 Trên Vercel Dashboard

### 1. Environment Variables (BẮT BUỘC)

Copy paste các biến này vào Vercel → Settings → Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@db.[region].supabase.co:5432/postgres

# Auth
JWT_SECRET=your-random-secret-key-min-32-characters

# R2 Storage  
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Build
NODE_ENV=production
```

### 2. Build Settings

- ✅ Framework: Next.js
- ✅ Root Directory: `nextjs-ecommerce`
- ✅ Build Command: `npm run build`
- ✅ Node Version: 22.x

### 3. Deploy

Click **Deploy** button!

## ✅ Sau Khi Deploy Thành Công

- [ ] Test homepage: `https://your-app.vercel.app/`
- [ ] Test login: `https://your-app.vercel.app/login`
- [ ] Test admin: `https://your-app.vercel.app/admin`
- [ ] Kiểm tra images có load từ R2 không
- [ ] Kiểm tra products có hiển thị không

## 🔧 Nếu Gặp Lỗi

### Lỗi 500 Internal Server Error

1. Check Vercel Function Logs
2. Verify DATABASE_URL correct
3. Verify database accessible from internet
4. Verify all environment variables set

### Trang Trống (No Products)

1. Check database có data không
2. Run seed: kết nối database và chạy seed script
3. Check R2 images uploaded

### Session/Login Không Hoạt Động

1. Verify JWT_SECRET được set
2. Check cookies được set (DevTools → Application → Cookies)
3. Try clear cookies và login lại

## 📞 Quick Fixes

```bash
# Nếu cần reseed database
npx prisma db push
npx prisma db seed

# Nếu cần upload images
npm run upload-images
```

---

**Build Status:** ✅ Ready to Deploy  
**Last Updated:** Node 22.20.0

