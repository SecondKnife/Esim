/**
 * VPS File Upload Utility
 * Handles file uploads to local filesystem on VPS
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

// Base upload directory on VPS
// Default: ./uploads (relative to backend directory)
// Can be set via UPLOAD_DIR env variable (absolute path)
const UPLOAD_DIR = process.env.UPLOAD_DIR 
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "uploads");

// Public URL for serving uploaded files
// Should be the backend API URL (e.g., https://api.yourdomain.com or Cloudflare Tunnel URL)
const PUBLIC_URL = process.env.PUBLIC_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Ensure upload directory exists
 */
function ensureUploadDir(folder: string): string {
  const folderPath = path.join(UPLOAD_DIR, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return folderPath;
}

/**
 * Generate unique filename
 */
function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext).replace(/\s+/g, "-");
  const timestamp = Date.now();
  const randomId = crypto.randomUUID().substring(0, 8);
  return `${timestamp}-${randomId}-${baseName}${ext}`;
}

/**
 * Upload file to VPS filesystem
 * @param buffer File buffer
 * @param fileName Original file name
 * @param contentType MIME type
 * @param folder Folder in uploads directory (e.g., 'products', 'categories', 'billboards')
 * @returns Public URL of uploaded file
 */
export async function uploadToVPS(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = "products"
): Promise<string> {
  try {
    // Ensure folder exists
    const folderPath = ensureUploadDir(folder);
    
    // Generate unique filename
    const uniqueFileName = generateFileName(fileName);
    const filePath = path.join(folderPath, uniqueFileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Return public URL
    // Format: http://your-vps-ip:5000/uploads/products/filename.jpg
    const publicUrl = `${PUBLIC_URL}/uploads/${folder}/${uniqueFileName}`;
    
    console.log(`✅ File uploaded to VPS: ${filePath}`);
    console.log(`📎 Public URL: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to VPS:", error);
    throw new Error("Failed to upload file to VPS");
  }
}

/**
 * Upload multiple files to VPS
 * @param files Array of file objects with buffer, fileName, contentType
 * @param folder Folder in uploads directory
 * @returns Array of public URLs
 */
export async function uploadMultipleToVPS(
  files: Array<{ buffer: Buffer; fileName: string; contentType: string }>,
  folder: string = "products"
): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadToVPS(file.buffer, file.fileName, file.contentType, folder)
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete file from VPS
 * @param fileUrl URL of file to delete
 */
export async function deleteFromVPS(fileUrl: string): Promise<void> {
  try {
    // Extract path from URL
    // URL format: http://your-vps-ip:5000/uploads/products/filename.jpg
    const url = new URL(fileUrl);
    const urlPath = url.pathname; // /uploads/products/filename.jpg
    
    // Remove /uploads prefix to get relative path
    const relativePath = urlPath.replace(/^\/uploads\//, "");
    const filePath = path.join(UPLOAD_DIR, relativePath);
    
    // Check if file exists and delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ File deleted from VPS: ${filePath}`);
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error("Error deleting from VPS:", error);
    throw new Error("Failed to delete file from VPS");
  }
}

/**
 * Delete multiple files from VPS
 * @param fileUrls Array of file URLs
 */
export async function deleteMultipleFromVPS(fileUrls: string[]): Promise<void> {
  const deletePromises = fileUrls.map((url) => deleteFromVPS(url));
  await Promise.all(deletePromises);
}

/**
 * Get public URL from file path
 * @param folder Folder name (e.g., 'products')
 * @param fileName File name
 * @returns Public URL
 */
export function getVPSPublicUrl(folder: string, fileName: string): string {
  return `${PUBLIC_URL}/uploads/${folder}/${fileName}`;
}

