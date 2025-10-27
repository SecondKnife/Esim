import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";

async function convertFileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const fileNames: string[] = [];
    if (!files) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (files) {
      for (const file of Array.from(files)) {
        if (file instanceof File) {
          const base64 = await convertFileToBase64(file);
          fileNames.push(base64);
        }
      }
    }

    const requestData = formData.get("requestData") as string;
    const productInfo = JSON.parse(requestData);

    const {
      title,
      description,
      price,
      featured,
      category,
      sizes,
      categoryId,
      discount,
    } = productInfo;

    if (
      !title ||
      title.length < 4 ||
      !description ||
      description.length < 4 ||
      !price ||
      !fileNames ||
      !category
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    let priceDiscount: number = 0;
    if (discount > 0) {
      const mathDiscount = (discount / 100) * +price;
      priceDiscount = +price - mathDiscount;
    }

    const product = await db?.product.create({
      data: {
        title,
        description,
        price,
        featured,
        imageURLs: JSON.stringify(fileNames),
        category,
        categoryId,
        discount,
        finalPrice: priceDiscount,
        productSizes: {
          create: sizes.map((size: any) => ({
            size: { connect: { id: size.id } },
            name: size.name,
          })),
        },
      },
    });
    return NextResponse.json({ msg: "Successful create product", product });
  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" });
  }
}

export async function GET(req: Request) {
  try {
    const tasks = await db.product.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Error getting products", status: 500 });
  }
}
