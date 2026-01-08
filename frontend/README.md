# Frontend Application

Next.js frontend application for the ecommerce platform. Configured for static export and CloudFront deployment.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

3. Set `NEXT_PUBLIC_API_URL` to your backend server URL

4. Start development server:
```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API server URL (e.g., http://localhost:5000)
- `NEXT_PUBLIC_R2_PUBLIC_URL`: Cloudflare R2 public URL for images
- `NEXT_PUBLIC_SITE_URL`: Frontend site URL

## Build for Production

Build static export:
```bash
npm run build
```

This will generate static files in the `out` directory.

## Deployment to CloudFront

1. Build the static export:
```bash
npm run build
```

2. Upload the `out` directory to S3 bucket

3. Configure CloudFront distribution:
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: Redirect 404 to `/index.html` (for client-side routing)

4. Update backend CORS settings to allow your CloudFront domain

## Features

- Static site generation
- Client-side routing
- API integration with backend server
- Image optimization (unoptimized for static export)
- Responsive design
