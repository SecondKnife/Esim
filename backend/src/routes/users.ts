import express, { Response } from "express";
import { db } from "../lib/db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all users (admin only)
router.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
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

// Get user by ID
router.get("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
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
