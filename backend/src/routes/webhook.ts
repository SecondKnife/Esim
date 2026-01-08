import express, { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { db } from "../lib/db";

const router = express.Router();

// Stripe webhook endpoint - raw body middleware is applied in server.ts
router.post("/", async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ error: "Missing Stripe signature" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        status: "paid",
        address: addressString,
        phone: session?.customer_details?.phone || "",
        deliveryAddress: addressString,
      },
      include: {
        orderItems: true,
      },
    });
  }

  return res.status(200).json({ received: true });
});

export default router;
