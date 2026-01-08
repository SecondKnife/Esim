import express, { Response } from "express";
import { db } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all sizes
router.get("/", async (req: any, res: Response) => {
  try {
    const sizes = await db.size.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(sizes);
  } catch (error) {
    return res.status(500).json({ error: "Error getting sizes" });
  }
});

// Create size (authenticated)
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const size = await db.size.create({
      data: { name },
    });
    return res.json({ msg: "Successful create size", size });
  } catch (error) {
    return res.status(500).json({ error: "Error creating size" });
  }
});

// Get size by ID
router.get("/:id", async (req: any, res: Response) => {
  const { id } = req.params;
  
  try {
    const size = await db.size.findUnique({
      where: { id },
    });

    if (!size) {
      return res.status(404).json({ error: "Size not found" });
    }

    return res.json(size);
  } catch (error) {
    return res.status(500).json({ error: "Error getting size" });
  }
});

// Get sizes by product ID
router.get("/product/:productId", async (req: any, res: Response) => {
  const { productId } = req.params;
  
  try {
    const productSizes = await db.productSize.findMany({
      where: { productId },
      include: {
        size: true,
      },
    });

    return res.json(productSizes);
  } catch (error) {
    return res.status(500).json({ error: "Error getting product sizes" });
  }
});

export default router;
