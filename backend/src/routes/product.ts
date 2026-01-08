import express, { Request, Response } from "express";
import { db } from "../lib/db";
import { getCurrentUser } from "../lib/get-current-user";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("📦 Fetching all products...");
    
    if (!db) {
      console.error("❌ Database client not initialized");
      return res.status(500).json({ error: "Database connection failed" });
    }

    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    console.log(`✅ Found ${products.length} products`);
    return res.json(products);
  } catch (error: any) {
    console.error("❌ Error getting products:", error);
    return res.status(500).json({
      error: "Error getting products",
      message: error.message || "Unknown error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Create product (admin only)
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;

    const {
      title,
      description,
      price,
      imageURLs,
      featured,
      category,
      sizes,
      categoryId,
      discount,
      country,
      region,
      dataPlan,
      validityDays,
      simType,
    } = body;

    if (
      !title ||
      title.length < 4 ||
      !description ||
      description.length < 4 ||
      !price ||
      !imageURLs ||
      !Array.isArray(imageURLs) ||
      imageURLs.length === 0 ||
      !category
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let priceDiscount: number = 0;
    if (discount > 0) {
      const mathDiscount = (discount / 100) * +price;
      priceDiscount = +price - mathDiscount;
    }

    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        featured,
        imageURLs: JSON.stringify(imageURLs),
        category,
        categoryId,
        discount,
        finalPrice: priceDiscount,
        country: country || null,
        region: region || null,
        dataPlan: dataPlan || null,
        validityDays: validityDays || null,
        simType: simType || null,
        productSizes: {
          create: (sizes || []).map((size: any) => ({
            size: { connect: { id: size.id } },
            name: size.name,
          })),
        },
      },
    });
    return res.json({ msg: "Successful create product", product });
  } catch (error) {
    return res.status(500).json({ error: "Error uploading file" });
  }
});

// Get product by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        productSizes: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error getting product" });
  }
});

// Delete product (admin only)
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const productSizes = await db.productSize.findMany({
      where: { productId: id },
    });

    const orderItems = await db.orderItem.findMany({
      where: { productId: id },
    });

    await Promise.all(
      orderItems.map(async (orderItem) => {
        await db.orderItem.delete({
          where: { id: orderItem.id },
        });
      })
    );

    await Promise.all(
      productSizes.map(async (productSize) => {
        await db.productSize.delete({
          where: { id: productSize.id },
        });
      })
    );

    await db.product.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting product" });
  }
});

// Get products by category
router.get("/category/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const products = await db.product.findMany({
      where: { categoryId: id },
      include: {
        productSizes: true,
      },
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Error getting products by category" });
  }
});

// Edit product (admin only)
router.put("/edit/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const body = req.body;
    const {
      title,
      description,
      price,
      imageURLs,
      featured,
      category,
      sizes,
      categoryId,
      discount,
      country,
      region,
      dataPlan,
      validityDays,
      simType,
    } = body;

    let priceDiscount: number = 0;
    if (discount > 0) {
      const mathDiscount = (discount / 100) * +price;
      priceDiscount = +price - mathDiscount;
    }

    // Delete existing product sizes
    await db.productSize.deleteMany({
      where: { productId: id },
    });

    const product = await db.product.update({
      where: { id },
      data: {
        title,
        description,
        price,
        featured,
        imageURLs: JSON.stringify(imageURLs),
        category,
        categoryId,
        discount,
        finalPrice: priceDiscount,
        country: country || null,
        region: region || null,
        dataPlan: dataPlan || null,
        validityDays: validityDays || null,
        simType: simType || null,
        productSizes: {
          create: (sizes || []).map((size: any) => ({
            size: { connect: { id: size.id } },
            name: size.name,
          })),
        },
      },
    });

    return res.json({ msg: "Successful update product", product });
  } catch (error) {
    return res.status(500).json({ error: "Error updating product" });
  }
});

export default router;
