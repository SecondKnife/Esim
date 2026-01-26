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
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
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

// Start server - listen on 0.0.0.0 to accept connections from any network interface (required for VPS)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Server accessible on: http://0.0.0.0:${PORT}`);
  
  // Test database connection
  db.$connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((error) => console.error("❌ Database connection failed:", error.message));
});

export default app;
