import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Cấu hình R2 Client (tương thích S3 API)
export const r2Client = new S3Client({
  region: "auto", // R2 không cần region cụ thể
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Upload file lên Cloudflare R2
 * @param file File object từ input
 * @param folder Thư mục trong bucket (vd: 'products', 'categories')
 * @returns Public URL của file
 */
export async function uploadToR2(
  file: File,
  folder: string = "products"
): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "",
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Trả về public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error("Failed to upload file to R2");
  }
}

/**
 * Upload multiple files lên R2
 * @param files Array of File objects
 * @param folder Thư mục trong bucket
 * @returns Array of public URLs
 */
export async function uploadMultipleToR2(
  files: File[],
  folder: string = "products"
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToR2(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Xóa file từ R2
 * @param fileUrl URL của file cần xóa
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "",
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error("Error deleting from R2:", error);
    throw new Error("Failed to delete file from R2");
  }
}

/**
 * Xóa nhiều files từ R2
 * @param fileUrls Array of file URLs
 */
export async function deleteMultipleFromR2(fileUrls: string[]): Promise<void> {
  const deletePromises = fileUrls.map((url) => deleteFromR2(url));
  await Promise.all(deletePromises);
}

/**
 * Get public URL từ file key
 * @param key File key trong bucket (vd: 'products/image.jpg')
 * @returns Public URL
 */
export function getR2PublicUrl(key: string): string {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}

/**
 * Convert base64 thành File object (useful cho upload từ editor)
 * @param base64 Base64 string
 * @param filename Tên file
 * @returns File object
 */
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

