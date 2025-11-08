import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CartItem } from "@/hooks/use-cart";
import { getCurrentUser } from "@/lib/get-current-user";
import { stripe } from "@/lib/stripe";

export const runtime = 'nodejs';

// Bank account info (you can move this to env or config)
const bankAccountInfo = {
  bankName: "Ngân hàng Techcombank",
  accountNumber: "1903 8765 4321",
  accountName: "CONG TY TNHH ESIM STORE",
  branch: "Chi nhánh Hà Nội",
};

export async function POST(req: Request) {
  try {
    const { items, customerInfo, paymentMethod, deliveryAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Product items are required" }, { status: 400 });
    }

    if (!customerInfo || !paymentMethod) {
      return NextResponse.json({ error: "Customer info and payment method are required" }, { status: 400 });
    }

    // Get current user if logged in
    const user = await getCurrentUser();

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
      status: paymentMethod === "cod" ? "pending_payment" : paymentMethod === "bank_transfer" ? "pending_payment" : "pending_payment",
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
      orderData.bankTransferInfo = JSON.stringify(bankAccountInfo);
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
        return NextResponse.json(
          { error: "Stripe payment is not configured. Please contact administrator." },
          { status: 500 }
        );
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
          success_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/cart?canceled=1`,
          metadata: {
            orderId: order.id,
          },
          customer_email: customerInfo.email,
        });

        return NextResponse.json({
          sessionId: session.id,
          orderId: order.id,
        });
      } catch (stripeError: any) {
        // If Stripe fails, delete the order and its items using transaction
        try {
          await db.$transaction(async (tx) => {
            // Delete order items first (due to foreign key constraint)
            await tx.orderItem.deleteMany({
              where: { orderId: order.id }
            });
            // Then delete the order
            await tx.order.delete({ 
              where: { id: order.id } 
            });
          });
        } catch (deleteError: any) {
          console.error("Error deleting order:", deleteError);
          // Continue even if delete fails - order will remain but user will see error
          // In production, you might want to log this to a monitoring service
        }
        return NextResponse.json(
          { error: `Stripe error: ${stripeError.message}` },
          { status: 500 }
        );
      }
    }

    // For bank transfer and COD
    return NextResponse.json({
      orderId: order.id,
      success: true,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
