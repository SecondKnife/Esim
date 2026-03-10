import express, { Response } from "express";
import { db } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all orders (authenticated)
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Error getting orders." });
  }
});

// Get order by ID
router.get("/:orderId", requireAuth, async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Error getting order" });
  }
});

// Update order status
router.patch("/:orderId", requireAuth, async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ error: "Error updating order status" });
  }
});

export default router;
