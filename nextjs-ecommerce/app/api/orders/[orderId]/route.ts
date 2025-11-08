import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-current-user";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getCurrentUser();
    const orderId = params.orderId;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Calculate total price
    const totalPrice = order.orderItems.reduce((total, item) => {
      return total + (item.product.finalPrice || item.product.price);
    }, 0);

    return NextResponse.json({
      ...order,
      totalPrice,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = params.orderId;
    const { status } = await req.json();

    const validStatuses = [
      "pending_payment",
      "paid",
      "shipping",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };

    // If status is paid, also update isPaid
    if (status === "paid") {
      updateData.isPaid = true;
    }

    // If status is delivered, also update isPaid if not already
    if (status === "delivered") {
      updateData.isPaid = true;
      if (updateData.status !== "paid") {
        updateData.status = "delivered";
      }
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

