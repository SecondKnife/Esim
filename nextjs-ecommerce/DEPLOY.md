# Hướng Dẫn Deploy lên Netlify

Dự án này đã được cấu hình để deploy lên Netlify với SQLite database và không cần AWS S3 hay Stripe.

## Thay Đổi Chính

✅ Đã đổi database từ MongoDB sang **SQLite**  
✅ Đã bỏ **AWS S3** - images được lưu dưới dạng base64 trong database  
✅ Đã bỏ **Stripe** - checkout đơn giản không dùng payment gateway  
✅ Đã config cho **Netlify deployment**

## Cài Đặt Local

1. **Clone và cài đặt dependencies:**
```bash
cd nextjs-ecommerce
npm install
```

2. **Setup database:**
```bash
# Tạo migration và database
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

Database SQLite sẽ được tạo tại `./dev.db`

3. **Chạy development server:**
```bash
npm run dev
```

## Environment Variables

File `.env` đã được cấu hình với các giá trị sau:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
FRONTEND_STORE_URL=http://localhost:3000
```

## Deploy lên Netlify

### Cách 1: Deploy qua Netlify Dashboard

1. **Push code lên GitHub**

2. **Tạo site mới trên Netlify:**
   - Vào https://app.netlify.com
   - Chọn "Add new site" > "Import an existing project"
   - Connect GitHub và chọn repository

3. **Cấu hình Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Thêm Environment Variables trong Netlify Dashboard:**
   - `DATABASE_URL`: Sẽ tự động được Netlify tạo
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Lấy từ Clerk dashboard
   - `CLERK_SECRET_KEY`: Lấy từ Clerk dashboard
   - `NEXT_PUBLIC_API_URL`: URL của Netlify site (sẽ tự động)
   - `FRONTEND_STORE_URL`: URL của Netlify site

5. **Deploy!**

### Cách 2: Deploy qua CLI

1. **Cài Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod
```

## Cấu Trúc Database

Database SQLite được lưu tại `./dev.db` với các bảng:
- `Product` - Sản phẩm
- `Category` - Danh mục
- `Billboard` - Banner
- `Size` - Kích cỡ
- `Order` - Đơn hàng
- `OrderItem` - Chi tiết đơn hàng

## Lưu Ý

⚠️ **SQLite trên Netlify:**
- SQLite database (`dev.db`) nên được commit vào git
- Database sẽ được reset mỗi khi deploy nếu không được handle đúng
- Nên sử dụng thêm service như Turso hoặc PlanetScale cho production

⚠️ **Images:**
- Images được lưu dưới dạng base64 trong database
- Phù hợp cho development và small projects
- Không phù hợp cho production với nhiều images lớn

## Troubleshooting

### Build fails với Prisma:
```bash
# Chạy generate trước khi build
npx prisma generate
npm run build
```

### Database not found:
```bash
# Tạo lại database
npx prisma migrate dev
```

### Lỗi Clerk authentication:
Kiểm tra lại environment variables trong Netlify dashboard

## Support

Nếu có lỗi, check logs trong Netlify dashboard hoặc chạy:
```bash
npm run build
```

