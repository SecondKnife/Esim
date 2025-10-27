import { db } from "@/lib/db";
import { getCurrentUser } from '@/lib/get-current-user';
import { NextResponse } from "next/server";

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
    const file: File | null = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const fileName = await convertFileToBase64(file);

    const requestData = formData.get("billboard") as string;
    const productInfo = JSON.parse(requestData);
    const title = productInfo;

    if (!title || title.length < 4) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const billboard = await db?.billboard.create({
      data: {
        billboard: title,
        imageURL: fileName,
      },
    });
    return NextResponse.json({ msg: "Successful create billboard", billboard });
  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" });
  }
}

export async function GET(req: Request) {
  try {
    const category = await db.billboard.findMany();
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({
      error: "Error getting billboards.",
      status: 500,
    });
  }
}
