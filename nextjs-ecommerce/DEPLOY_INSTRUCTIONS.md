# Hướng dẫn Deploy eSIM Store lên Production

## 📦 Database Setup cho Deploy

### Option 1: SQLite (Development) - Đã có sẵn
```bash
# File database đã có sẵn tại prisma/dev.db
# Chỉ cần chạy:
npm run dev
```

### Option 2: PostgreSQL (Production - Khuyên dùng)

#### Setup PostgreSQL database:

1. **Tạo database trên VPS/Cloud:**
```bash
# Install PostgreSQL trên server
sudo apt update
sudo apt install postgresql postgresql-contrib

# Tạo database
sudo -u postgres psql
CREATE DATABASE esim_store;
CREATE USER esim_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE esim_store TO esim_user;
\q
```

2. **Cập nhật .env:**
```env
DATABASE_URL="postgresql://esim_user:your_secure_password@localhost:5432/esim_store"
```

3. **Chạy migration:**
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Option 3: Cloud Database (MySQL/PostgreSQL)

**Vercel Postgres:**
```bash
# Cài Vercel CLI
npm i -g vercel

# Link project
vercel link

# Tạo Postgres database
vercel postgres create

# Cập nhật .env với connection string từ Vercel
```

**PlanetScale (MySQL):**
```bash
# Install PlanetScale CLI
brew install planetscale/tap/pscale

# Login
pscale auth login

# Create database
pscale database create esim_store

# Connect
pscale connect esim_store main --port 3309
```

**Supabase (PostgreSQL):**
1. Tạo project tại https://supabase.com
2. Copy connection string
3. Cập nhật `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

## 🚀 Deploy lên Vercel (Khuyên dùng)

### 1. Push code lên GitHub
```bash
git add .
git commit -m "eSIM Store - Ready for deploy"
git push origin develop
```

### 2. Deploy lên Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Hoặc deploy production
vercel --prod
```

### 3. Cấu hình Environment Variables trên Vercel
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret key cho JWT (generate random string)
- `NEXT_PUBLIC_API_URL` - URL của API (thường là domain của bạn)
- Clerk keys (nếu còn dùng Clerk)

### 4. Setup Build Command
Trong Vercel dashboard:
- Build Command: `npm run build && npx prisma generate`
- Output Directory: `.next`

## 🐳 Deploy với Docker

### 1. Tạo Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Tạo docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/esim_store
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=esim_store
      - POSTGRES_USER=esim_user
      - POSTGRES_PASSWORD=your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Deploy
```bash
docker-compose up -d
```

## 🔐 Production Checklist

### Security
- [ ] Đổi `JWT_SECRET` thành random string mạnh
- [ ] Cập nhật `NEXT_PUBLIC_API_URL` đúng domain production
- [ ] Setup HTTPS (SSL certificate)
- [ ] Bật CORS nếu cần
- [ ] Setup rate limiting

### Database
- [ ] Backup database thường xuyên
- [ ] Setup database replication (optional)
- [ ] Monitor database performance

### Environment Variables
```env
# Production .env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="[RANDOM_SECURE_STRING]"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
```

### Testing
- [ ] Test authentication flow
- [ ] Test product pages
- [ ] Test checkout process
- [ ] Test admin panel
- [ ] Load testing

## 📊 Monitoring & Analytics

### 1. Setup Vercel Analytics
```bash
npm install @vercel/analytics
```

### 2. Setup Error Tracking
```bash
npm install @sentry/nextjs
```

### 3. Performance Monitoring
- Vercel Dashboard
- Google Analytics
- Hotjar (optional)

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
Tạo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run prisma:migrate
      - run: npm run prisma:seed
      # Add deploy steps here
```

## 📝 Next Steps

1. **Setup Custom Domain**
   - Mua domain
   - Cấu hình DNS trên Vercel
   - Setup SSL certificate

2. **Setup Email Service**
   - Nodemailer
   - SendGrid
   - AWS SES

3. **Setup Payment Gateway**
   - Stripe (đã có)
   - PayPal
   - VNPay (cho Vietnam)

4. **SEO Optimization**
   - Sitemap.xml
   - robots.txt
   - Meta tags
   - Open Graph

## 🆘 Troubleshooting

### Database connection issues
```bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# Regenerate client
npm run prisma:generate
```

### Build errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build
```

## 📞 Support

Nếu gặp vấn đề, check:
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs
- Vercel Documentation: https://vercel.com/docs
