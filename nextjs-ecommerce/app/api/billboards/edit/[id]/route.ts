import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

async function convertFileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();
  try {


    const billboard = await db.billboard.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    return NextResponse.json({ error: "Error getting billboard", status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  try {
    const formData = await req.formData();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const file: File | null = formData.get("file") as File;
    const requestData = formData.get("billboard") as string;
    const productInfo = JSON.parse(requestData);
    const title = productInfo;

    let fileName: string | undefined;

    if (file && file instanceof File && file.name) {
      fileName = await convertFileToBase64(file);
    }

    if (!title || title.length < 4) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const updateData: {
      billboard: string;
      imageURL?: string;
    } = {
      billboard: title,
    };

    if (fileName) {
      updateData.imageURL = fileName;
    }
    const product = await db.billboard.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json({ product, msg: "Successful edit billboard" });
  } catch (error) {
    return NextResponse.json({
      error: "Error ediiting billboard",
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    const billboard = await db.billboard.findUnique({
      where: {
        id,
      },
    });

    const task = await db.billboard.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({
      error: "Error deleting billboard",
      status: 500,
    });
  }
}
