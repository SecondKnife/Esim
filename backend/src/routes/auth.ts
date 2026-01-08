import express, { Request, Response } from "express";
import { db } from "../lib/db";
import { hashPassword, verifyPassword, createSession, deleteSession, getSession } from "../lib/auth";
import cookieParser from "cookie-parser";

const router = express.Router();

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    console.log("🔐 Login API called");
    
    // Check database connection
    if (!db) {
      console.error("❌ Database client not initialized");
      return res.status(500).json({ error: "Database connection failed" });
    }

    const { email, password } = req.body;
    console.log("📧 Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    console.log("🔍 Searching for user...");
    const user = await db.user.findUnique({
      where: { email },
    });

    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials - User not found" });
    }

    // Verify password
    console.log("🔑 Verifying password...");
    const isValid = await verifyPassword(password, user.password);
    console.log("✅ Password valid:", isValid);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials - Wrong password" });
    }

    // Create session
    console.log("🎫 Creating session...");
    const token = await createSession(user.id);
    console.log("✅ Session created:", token.substring(0, 20) + "...");

    // Set cookie
    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
      path: "/",
    });

    console.log("✅ Login successful for:", user.email);

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("❌ Login error:", error);
    console.error("❌ Error stack:", error.stack);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Unknown error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Signup endpoint
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = await createSession(user.id);

    // Set cookie
    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      path: "/",
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.session || req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      await deleteSession(token);
    }

    // Clear cookie
    res.cookie("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user endpoint
router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.session || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.json({ user: null });
    }

    const session = await getSession(token);

    if (!session) {
      return res.json({ user: null });
    }

    return res.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    });
  } catch (error) {
    return res.json({ user: null });
  }
});

export default router;
