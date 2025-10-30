import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await getCurrentUser();

  try {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        productSizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Error getting product", status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await getCurrentUser();

  try {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const body = await req.json();

    const {
      title,
      price,
      description,
      category,
      featured,
      discount,
      imageURLs,
      sizes,
    } = body;

    const convPrice = +price;

    // Get existing sizes for this product
    const existingSizes = await db.productSize.findMany({
      where: {
        productId: id,
      },
      select: {
        id: true,
        sizeId: true,
      },
    });

    const existingSizeIds = existingSizes.map((item) => item.sizeId);
    const newSizes = sizes || [];
    
    // Find new sizes to add
    const sizesToAdd = newSizes.filter(
      (size: any) => !existingSizeIds.includes(size.sizeId || size.id)
    );

    let priceDiscount: number = 0;
    
    if (discount && discount > 0) {
      const mathDiscount = (discount / 100) * convPrice;
      priceDiscount = convPrice - mathDiscount;
    }

    const updateData: any = {
      featured: featured || false,
      title,
      price: convPrice,
      description,
      category,
      finalPrice: priceDiscount,
    };

    if (discount && discount > 0) {
      updateData.discount = +discount;
    }
    
    // Only update imageURLs if provided
    if (imageURLs && Array.isArray(imageURLs) && imageURLs.length > 0) {
      updateData.imageURLs = JSON.stringify(imageURLs);
    }

    // Add new sizes if any
    if (sizesToAdd.length > 0) {
      updateData.productSizes = {
        create: sizesToAdd.map((size: any) => ({
          size: { connect: { id: size.sizeId || size.id } },
          name: size.name,
        })),
      };
    }

    const product = await db.product.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json({ product, msg: "Successful edit product" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Error updating product", status: 500 });
  }
}
