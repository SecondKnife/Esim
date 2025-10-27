import { NextResponse } from "next/server";
import { uploadToR2, uploadMultipleToR2 } from "@/lib/r2";
import { getCurrentUser } from "@/lib/get-current-user";

export async function POST(req: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "products";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Upload single or multiple files
    let urls: string[];
    if (files.length === 1) {
      const url = await uploadToR2(files[0], folder);
      urls = [url];
    } else {
      urls = await uploadMultipleToR2(files, folder);
    }

    return NextResponse.json({
      success: true,
      urls,
      message: `Successfully uploaded ${urls.length} file(s)`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

