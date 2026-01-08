import express, { Response } from "express";
import { db } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

type GraphData = {
  name: string;
  total: number;
};

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

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of orders) {
      const month = order.createdAt.getMonth();
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        revenueForOrder += +item.product.price;
      }

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return res.json(graphData);
  } catch (error) {
    return res.status(500).json({ error: "Error getting graph data." });
  }
});

export default router;
