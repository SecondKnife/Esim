/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      // Unsplash images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Thêm custom domain của bạn nếu có
      // {
      //   protocol: "https",
      //   hostname: "cdn.yourdomain.com",
      // },
      // Giữ lại S3 cho compatibility
      {
        protocol: "https",
        hostname: "kemal-web-storage.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
  // Static export for CloudFront deployment
  output: 'export',
  trailingSlash: true,
  // Disable server-side features for static export
  reactStrictMode: true,
  // Optimize build performance
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Disable RSC (React Server Components) for static export
  // This prevents Next.js from trying to fetch RSC payloads (index.txt?_rsc=)
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Suppress RSC requests in static export
  // This tells Next.js to not attempt RSC fetches
  generateBuildId: async () => {
    return 'static-build';
  },
};

module.exports = nextConfig;
