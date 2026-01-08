# Ecommerce Project - Separated Architecture

Dự án đã được tách thành Backend (BE) và Frontend (FE) để có thể deploy riêng biệt.

## 📁 Cấu trúc dự án

```
.
├── backend/              # Express.js API Server (Deploy lên VPS)
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── lib/         # Utilities (db, auth, r2, stripe)
│   │   ├── middleware/  # Auth middleware
│   │   └── server.ts    # Express server entry point
│   ├── prisma/          # Prisma schema và migrations
│   └── package.json
│
├── frontend/            # Next.js Static Site (Deploy lên CloudFront)
│   ├── app/             # Next.js app directory (không có API routes)
│   ├── components/      # React components
│   ├── lib/
│   │   ├── api-client.ts  # API client để gọi backend
│   │   └── apiCalls.ts    # Wrapper functions
│   └── package.json
│
└── DEPLOYMENT.md        # Hướng dẫn deploy chi tiết
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Cấu hình .env với database và các keys
npm run prisma:generate
npm run prisma:migrate
npm run dev  # Development server trên port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Cấu hình NEXT_PUBLIC_API_URL trỏ đến backend server
npm run dev  # Development server trên port 3000
```

## 🔧 Kiến trúc

### Backend (Express.js)
- **Port**: 5000 (có thể thay đổi trong .env)
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: JWT tokens với sessions
- **File Storage**: Cloudflare R2
- **Payment**: Stripe integration

### Frontend (Next.js Static Export)
- **Build Output**: Static files trong thư mục `out/`
- **API Communication**: Gọi backend qua REST API
- **Authentication**: Client-side với cookies
- **Deployment**: CloudFront + S3

## 📡 API Endpoints

Tất cả API endpoints đều có prefix `/api`:

- **Auth**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/me`
- **Products**: `/api/product`, `/api/product/:id`
- **Categories**: `/api/categories`
- **Orders**: `/api/orders`
- **Checkout**: `/api/checkout`
- **Upload**: `/api/upload`
- Và nhiều endpoints khác...

Xem chi tiết trong `backend/README.md`

## 🗂️ Kiến trúc đã tách

Dự án đã được tách thành Backend và Frontend:

1. **Backend**: Tất cả API routes → `backend/src/routes/`
2. **Backend**: Database utilities → `backend/src/lib/`
3. **Backend**: Prisma schema → `backend/prisma/`
4. **Backend**: Scripts (seed, migration) → `backend/scripts/`
5. **Frontend**: Components và pages → `frontend/app/` và `frontend/components/`
6. **Frontend**: API calls → `frontend/lib/api-client.ts`
7. **Frontend**: Cấu hình static export cho CloudFront

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=...
STRIPE_SECRET_KEY=...
R2_ACCOUNT_ID=...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_R2_PUBLIC_URL=https://...
```

## 🚢 Deployment

Xem hướng dẫn chi tiết trong `DEPLOYMENT.md`:

- **Backend**: Deploy lên VPS với PM2
- **Frontend**: Deploy lên CloudFront + S3

## 🔐 Authentication Flow

1. User login → Frontend gọi `/api/auth/login`
2. Backend tạo JWT token và set cookie
3. Frontend lưu cookie và gọi `/api/auth/me` để lấy user info
4. Protected routes check authentication client-side
5. API calls tự động include cookies

## 📚 Documentation

- `backend/README.md` - Backend setup và API documentation
- `frontend/README.md` - Frontend setup và build instructions
- `DEPLOYMENT.md` - Chi tiết về deployment process

## ⚠️ Lưu ý

1. **CORS**: Backend cần cấu hình CORS để cho phép frontend domain
2. **Cookies**: Cần cấu hình `credentials: 'include'` trong API calls
3. **Static Export**: Frontend không thể dùng server-side features như `getServerSideProps`
4. **Middleware**: Middleware trong Next.js vẫn chạy nhưng không thể check auth server-side
5. **Environment Variables**: Frontend chỉ có thể dùng biến bắt đầu với `NEXT_PUBLIC_`

## 🛠️ Development

### Backend
```bash
cd backend
npm run dev  # Watch mode với tsx
npm run build  # Build TypeScript
npm start  # Run production build
```

### Frontend
```bash
cd frontend
npm run dev  # Development server
npm run build  # Build static export
```

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. Backend server đang chạy và accessible
2. Environment variables đã được cấu hình đúng
3. CORS settings trong backend
4. Network requests trong browser console
