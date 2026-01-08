import express, { Response } from "express";
import { db } from "../lib/db";
import { getCurrentUser } from "../lib/get-current-user";
import { stripe } from "../lib/stripe";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

// Bank account info (you can move this to env or config)
const bankAccountInfo = {
  bankName: "Ngân hàng Techcombank",
  accountNumber: "1903 8765 4321",
  accountName: "CONG TY TNHH ESIM STORE",
  branch: "Chi nhánh Hà Nội",
};

interface CartItem {
  id: string;
  title: string;
  price: number;
  totalPrice?: number;
}

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { items, customerInfo, paymentMethod, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Product items are required" });
    }

    if (!customerInfo || !paymentMethod) {
      return res.status(400).json({ error: "Customer info and payment method are required" });
    }

    // Validate delivery address for COD and bank transfer
    if (
      (paymentMethod === "cod" || paymentMethod === "bank_transfer") &&
      !deliveryAddress &&
      !customerInfo.address
    ) {
      return res
        .status(400)
        .json({ error: "Delivery address is required for COD and bank transfer orders" });
    }

    // Get current user if logged in
    const user = await getCurrentUser(req);

    // Calculate total price
    const totalPrice = items.reduce((total: number, item: CartItem) => {
      return total + Number(item.totalPrice || item.price);
    }, 0);

    // Create order
    const orderData: any = {
      isPaid: paymentMethod === "visa" ? false : paymentMethod === "cod" ? false : false,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      deliveryAddress: deliveryAddress || customerInfo.address || "",
      paymentMethod: paymentMethod,
      status:
        paymentMethod === "cod"
          ? "pending_payment"
          : paymentMethod === "bank_transfer"
          ? "pending_payment"
          : "pending_payment",
      orderItems: {
        create: items.map((product: CartItem) => ({
          productName: product.title,
          product: {
            connect: {
              id: product.id,
            },
          },
        })),
      },
    };

    // Add user if logged in
    if (user) {
      orderData.user = {
        connect: {
          id: user.id,
        },
      };
    }

    // Add bank transfer info if payment method is bank_transfer
    if (paymentMethod === "bank_transfer") {
      // Generate transfer content: product names + phone number
      const productNames = items.map((item: CartItem) => item.title).join(" - ");
      const transferContent = `${productNames} - ${customerInfo.phone}`;

      orderData.bankTransferInfo = JSON.stringify({
        ...bankAccountInfo,
        transferContent: transferContent,
      });

      // Set payment deadline: 15 minutes from now
      const now = new Date();
      const paymentDeadline = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
      orderData.paymentDeadline = paymentDeadline;
    }

    const order = await db.order.create({
      data: orderData,
    });

    // Handle Stripe payment
    if (paymentMethod === "visa") {
      // Validate Stripe configuration
      const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
      if (!stripeKey || stripeKey.includes("placeholder") || stripeKey.length < 20) {
        // Delete the order if Stripe is not configured
        try {
          await db.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({ where: { orderId: order.id } });
            await tx.order.delete({ where: { id: order.id } });
          });
        } catch (deleteError) {
          console.error("Error deleting order:", deleteError);
        }
        return res.status(500).json({
          error: "Stripe payment is not configured. Please contact administrator.",
        });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: items.map((item: CartItem) => ({
            price_data: {
              currency: "vnd",
              product_data: {
                name: item.title,
              },
              unit_amount: Math.round(Number(item.totalPrice || item.price)),
            },
            quantity: 1,
          })),
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}`,
          cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/cart?canceled=1`,
          metadata: {
            orderId: order.id,
          },
          customer_email: customerInfo.email,
        });

        return res.json({
          sessionId: session.id,
          orderId: order.id,
        });
      } catch (stripeError: any) {
        // If Stripe fails, delete the order and its items using transaction
        try {
          await db.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({
              where: { orderId: order.id },
            });
            await tx.order.delete({
              where: { id: order.id },
            });
          });
        } catch (deleteError: any) {
          console.error("Error deleting order:", deleteError);
        }
        return res.status(500).json({
          error: `Stripe error: ${stripeError.message}`,
        });
      }
    }

    // For bank transfer and COD
    return res.json({
      orderId: order.id,
      success: true,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

export default router;
