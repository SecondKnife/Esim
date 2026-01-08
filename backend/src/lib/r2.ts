import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Configure R2 Client (S3 compatible API)
export const r2Client = new S3Client({
  region: "auto", // R2 doesn't need specific region
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Upload file to Cloudflare R2
 * @param file File buffer or stream
 * @param fileName File name
 * @param contentType MIME type
 * @param folder Folder in bucket (e.g., 'products', 'categories')
 * @returns Public URL of file
 */
export async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = "products"
): Promise<string> {
  try {
    const key = `${folder}/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "",
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Return public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error("Failed to upload file to R2");
  }
}

/**
 * Upload multiple files to R2
 * @param files Array of file objects with buffer, fileName, contentType
 * @param folder Folder in bucket
 * @returns Array of public URLs
 */
export async function uploadMultipleToR2(
  files: Array<{ buffer: Buffer; fileName: string; contentType: string }>,
  folder: string = "products"
): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadToR2(file.buffer, file.fileName, file.contentType, folder)
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete file from R2
 * @param fileUrl URL of file to delete
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
 * Delete multiple files from R2
 * @param fileUrls Array of file URLs
 */
export async function deleteMultipleFromR2(fileUrls: string[]): Promise<void> {
  const deletePromises = fileUrls.map((url) => deleteFromR2(url));
  await Promise.all(deletePromises);
}

/**
 * Get public URL from file key
 * @param key File key in bucket (e.g., 'products/image.jpg')
 * @returns Public URL
 */
export function getR2PublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
