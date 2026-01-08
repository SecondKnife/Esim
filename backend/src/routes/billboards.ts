import express, { Response } from "express";
import { db } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all billboards
router.get("/", async (req: any, res: Response) => {
  try {
    const billboards = await db.billboard.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(billboards);
  } catch (error) {
    return res.status(500).json({ error: "Error getting billboards" });
  }
});

// Create billboard (authenticated)
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { billboard, imageURL } = req.body;

    if (!billboard || !imageURL) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const billboardProduct = await db.billboard.create({
      data: {
        billboard,
        imageURL,
      },
    });
    return res.json({
      msg: "Successful create billboard",
      billboardProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error creating billboard" });
  }
});

// Edit billboard
router.put("/edit/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const { billboard, imageURL } = req.body;

    const billboardProduct = await db.billboard.update({
      where: { id },
      data: {
        billboard,
        imageURL,
      },
    });

    return res.json({
      msg: "Successful update billboard",
      billboardProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating billboard" });
  }
});

export default router;
