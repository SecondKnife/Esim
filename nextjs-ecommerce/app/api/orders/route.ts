import { db } from "@/lib/db";
import { getCurrentUser } from '@/lib/get-current-user';
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Error getting orders.", status: 500 });
  }
}
