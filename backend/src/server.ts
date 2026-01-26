// Load environment variables FIRST, before importing anything that uses them
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Now import other modules that depend on environment variables
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./lib/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
// Allow requests from frontend URL and Cloudflare Pages domains
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  // Cloudflare Pages domains (wildcard for all Pages deployments)
  /^https:\/\/.*\.pages\.dev$/,
  /^https:\/\/.*\.workers\.dev$/,
  // Add your custom domain if you have one
  // "https://yourdomain.com",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import categoryRoutes from "./routes/categories";
import billboardRoutes from "./routes/billboards";
import orderRoutes from "./routes/orders";
import userRoutes from "./routes/users";
import sizeRoutes from "./routes/sizes";
import uploadRoutes from "./routes/upload";
import checkoutRoutes from "./routes/checkout";
import webhookRoutes from "./routes/webhook";
import graphRoutes from "./routes/graph";
import clerkRoutes from "./routes/clerk";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/billboards", billboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/checkout", checkoutRoutes);
// Webhook route needs raw body for Stripe signature verification
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/clerk", clerkRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  
  // Test database connection
  db.$connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((error) => console.error("❌ Database connection failed:", error.message));
});

export default app;
