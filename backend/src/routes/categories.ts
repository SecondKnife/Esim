import express, { Response } from "express";
import { db } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all categories
router.get("/", async (req: any, res: Response) => {
  try {
    console.log("📂 Fetching all categories...");
    
    if (!db) {
      console.error("❌ Database client not initialized");
      return res.status(500).json({ error: "Database connection failed" });
    }

    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    console.log(`✅ Found ${categories.length} categories`);
    return res.json(categories);
  } catch (error: any) {
    console.error("❌ Error getting categories:", error);
    return res.status(500).json({
      error: "Error getting categories",
      message: error.message || "Unknown error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Create category (authenticated)
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { category, billboard, billboardId } = req.body;

    if (!category || category.length < 2) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const categoryCase = category.toLowerCase();

    const categoryProduct = await db.category.create({
      data: {
        category: categoryCase,
        billboard,
        billboardId,
      },
    });
    return res.json({
      msg: "Successful create category",
      categoryProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error creating category" });
  }
});

// Edit category
router.put("/edit/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const { category, billboard, billboardId } = req.body;

    const categoryProduct = await db.category.update({
      where: { id },
      data: {
        category: category?.toLowerCase(),
        billboard,
        billboardId,
      },
    });

    return res.json({
      msg: "Successful update category",
      categoryProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating category" });
  }
});

export default router;
