# Troubleshooting Guide

## Lỗi: "Cannot find module .next/server/app/not-found_client-reference-manifest.js"

### Nguyên nhân:
- Build cache của Next.js bị corrupt
- Hot reload conflict
- Missing dependencies

### Giải pháp:

#### Bước 1: Clear cache và rebuild
```bash
# Xóa .next folder
rm -rf .next

# Hoặc trên Windows:
Remove-Item -Recurse -Force .next

# Chạy lại dev server
npm run dev
```

#### Bước 2: Nếu vẫn lỗi - Clean install
```bash
# Xóa tất cả cache
rm -rf .next node_modules package-lock.json

# Cài đặt lại
npm install

# Chạy dev
npm run dev
```

#### Bước 3: Rebuild Prisma
```bash
# Generate Prisma client
npx prisma generate

# Chạy dev
npm run dev
```

#### Bước 4: Check environment variables
Đảm bảo file `.env` có đủ các biến:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
NEXT_PUBLIC_API_URL="http://localhost:3000"
FRONTEND_STORE_URL="http://localhost:3000"
```

## Các lỗi khác thường gặp

### Lỗi: "Port 3000 is in use"
```bash
# Kill process đang dùng port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc để Next.js tự chọn port khác (3001, 3002...)
npm run dev
```

### Lỗi: Prisma Client not generated
```bash
npx prisma generate
```

### Lỗi: Database connection
```bash
# Check DATABASE_URL trong .env
# Chạy migration
npx prisma migrate dev
```

### Lỗi: R2 Upload failed
Kiểm tra `.env`:
```env
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."  # Quan trọng!
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

## Tips

### Clear toàn bộ và start fresh:
```bash
# Xóa tất cả
rm -rf .next node_modules package-lock.json

# Cài lại
npm install

# Generate Prisma
npx prisma generate

# Migrate DB
npx prisma migrate dev

# Seed data
npx tsx prisma/seed-simple.ts

# Chạy dev
npm run dev
```

### Check logs chi tiết:
```bash
# Chạy với verbose logging
npm run dev --verbose
```

### Build production để test:
```bash
npm run build
npm run start
```

