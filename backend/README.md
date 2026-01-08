# Backend API Server

Express.js backend server for the ecommerce application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

**IMPORTANT**: Make sure to set a valid `DATABASE_URL` in your `.env` file. For example:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

3. Set up Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start development server:
```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (REQUIRED)
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend application URL for CORS
- `JWT_SECRET`: Secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `R2_ACCOUNT_ID`: Cloudflare R2 account ID
- `R2_ACCESS_KEY_ID`: R2 access key ID
- `R2_SECRET_ACCESS_KEY`: R2 secret access key
- `R2_BUCKET_NAME`: R2 bucket name
- `R2_PUBLIC_URL`: Public URL for R2 bucket

## Troubleshooting

### DATABASE_URL Error

If you see the error "You must provide a nonempty URL", make sure:

1. Your `.env` file exists in the `backend/` directory
2. `DATABASE_URL` is set and not empty
3. The format is correct: `DATABASE_URL="postgresql://user:password@host:port/database"`
4. No extra spaces or quotes issues

Example `.env` file:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User signup
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get product by ID
- `POST /api/product` - Create product (admin)
- `PUT /api/product/edit/:id` - Update product (admin)
- `DELETE /api/product/:id` - Delete product (admin)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (auth)
- `GET /api/orders` - Get all orders (auth)
- `POST /api/checkout` - Create checkout session
- `POST /api/upload` - Upload files (admin)
- And more...

## Deployment to VPS

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Use PM2 or similar process manager:
```bash
pm2 start dist/server.js --name backend-api
```
