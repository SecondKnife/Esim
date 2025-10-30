# 🔍 Debug Guide - Vercel Deployment

## 🏥 Health Check API

Sau khi deploy, truy cập:
```
https://your-app.vercel.app/api/health
```

Kết quả mong đợi:
```json
{
  "status": "healthy",
  "message": "All systems operational",
  "database": {
    "connected": true,
    "users": 1,
    "products": 10,
    "categories": 5
  },
  "environment": {
    "NODE_ENV": "production",
    "hasJWT": true
  },
  "timestamp": "2025-10-30T12:00:00.000Z"
}
```

## ❌ Các Lỗi Thường Gặp

### 1. **500 Internal Server Error - Login API**

**Triệu chứng:**
- Login API trả về 500
- Console log: "Database connection failed"

**Nguyên nhân:**
- `DATABASE_URL` chưa được set trong Vercel
- Database không accessible từ internet
- Connection string sai format

**Giải pháp:**

#### Bước 1: Kiểm tra Environment Variables
```bash
# Trong Vercel Dashboard
Settings → Environment Variables → Kiểm tra:

DATABASE_URL=postgresql://postgres.[ref]:[password]@db.[region].supabase.co:5432/postgres
```

#### Bước 2: Test Connection String
```sql
-- Chạy trong Supabase SQL Editor
SELECT NOW();
```

#### Bước 3: Kiểm tra Supabase Settings
- Settings → Database → Connection Pooling
- Đảm bảo "Enable connection pooling" được BẬT
- Sử dụng connection string có `?pgbouncer=true`

#### Bước 4: Redeploy
```bash
# Trong Vercel Dashboard
Deployments → Latest → ... → Redeploy
```

### 2. **"Error getting products" - Status 500**

**Triệu chứng:**
- Shop page trống
- Console: "Error getting products"

**Debug Steps:**

#### Check 1: Health Check
```
https://your-app.vercel.app/api/health
```
Nếu unhealthy → Database issue

#### Check 2: Direct API Call
```
https://your-app.vercel.app/api/product
```
Kiểm tra response

#### Check 3: Vercel Function Logs
```
Vercel Dashboard → Deployments → Latest → Functions
→ Click vào function bị lỗi
→ Xem logs chi tiết
```

**Giải pháp:**
- Nếu "PrismaClientInitializationError" → DATABASE_URL sai
- Nếu "Connection timeout" → Supabase firewall/IP whitelist
- Nếu "Table not found" → Chạy migration

### 3. **Database Table Not Found**

**Triệu chứng:**
```
relation "public.Product" does not exist
```

**Giải pháp:**
```bash
# Run migration trên database
npx prisma migrate deploy

# Hoặc trong Supabase SQL Editor, chạy migration SQL
```

### 4. **No Admin User**

**Triệu chứng:**
- Login với admin@admin.com không được
- "User not found"

**Giải pháp:**

#### Option 1: Chạy Seed Script
```bash
# Local
DATABASE_URL="your-prod-url" npx prisma db seed
```

#### Option 2: Tạo User Manually
```sql
-- Trong Supabase SQL Editor
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'cm123456',
  'Admin',
  'admin@admin.com',
  '$2a$10$hashed_password_here', -- Use bcrypt hash
  'ADMIN',
  NOW(),
  NOW()
);
```

#### Option 3: Sử dụng Script
```bash
# Tạo file create-admin.sql trong Supabase
-- Xem lib/create-admin.ts để lấy hashed password
```

## 📊 Debugging Tools

### 1. **Vercel Function Logs**
```
Dashboard → Deployments → Click deployment → Functions tab
```

### 2. **Real-time Logs**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs your-app-name --follow
```

### 3. **Database Logs**
```
Supabase Dashboard → Logs → Postgres Logs
```

## 🔧 Common Fixes

### Fix 1: Reset Database Connection
```bash
# In Vercel
Settings → Environment Variables
→ Delete DATABASE_URL
→ Re-add DATABASE_URL
→ Redeploy
```

### Fix 2: Connection Pooling
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Add this
}
```

```bash
# In Vercel Environment Variables
DATABASE_URL=postgresql://postgres:password@host:5432/db?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@host:5432/db
```

### Fix 3: Increase Function Timeout
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 📞 Quick Diagnostic Checklist

- [ ] `/api/health` returns healthy ✅
- [ ] `/api/product` returns products ✅
- [ ] `/api/categories` returns categories ✅
- [ ] Login works ✅
- [ ] Database has data (check Supabase) ✅
- [ ] Environment variables set correctly ✅
- [ ] Migration applied ✅
- [ ] Admin user exists ✅

## 🆘 Still Not Working?

### Step 1: Check Vercel Logs
```
Vercel Dashboard → Your Project → Deployments → Latest
→ Building → View Function Logs
```

### Step 2: Check Database
```
Supabase → SQL Editor → Run:
SELECT * FROM "User" LIMIT 1;
SELECT * FROM "Product" LIMIT 1;
```

### Step 3: Test Local with Production DB
```bash
# .env.local
DATABASE_URL="your-production-url"

npm run dev
# Test if it works locally with prod DB
```

### Step 4: Enable Debug Mode
```bash
# Vercel Environment Variables
DEBUG=prisma:*
NODE_ENV=development  # Temporarily for more logs
```

---

**Most Common Issue:** 99% là do `DATABASE_URL` chưa được set đúng trong Vercel! 🎯

