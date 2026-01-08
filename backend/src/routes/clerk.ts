import express, { Response } from "express";
import { db } from "../lib/db";
import { hashPassword } from "../lib/auth";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Create user (admin only)
router.post("/users", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, isAdmin, userName } = req.body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const role = isAdmin === "Admin" ? "ADMIN" : "USER";
    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name: userName,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
});

// Get all users (admin only)
router.get("/users", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ user: users });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Get user by ID (admin only)
router.get("/users/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Error getting user" });
  }
});

export default router;
