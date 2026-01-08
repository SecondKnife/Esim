import express, { Response } from "express";
import multer from "multer";
import { uploadToR2, uploadMultipleToR2 } from "../lib/r2";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload single or multiple files
router.post("/", requireAdmin, upload.array("files", 10), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const folder = (req.body.folder as string) || "products";

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    // Convert multer files to R2 upload format
    const uploadFiles = files.map((file) => ({
      buffer: file.buffer,
      fileName: file.originalname,
      contentType: file.mimetype,
    }));

    // Upload single or multiple files
    let urls: string[];
    if (uploadFiles.length === 1) {
      const url = await uploadToR2(
        uploadFiles[0].buffer,
        uploadFiles[0].fileName,
        uploadFiles[0].contentType,
        folder
      );
      urls = [url];
    } else {
      urls = await uploadMultipleToR2(uploadFiles, folder);
    }

    return res.json({
      success: true,
      urls,
      message: `Successfully uploaded ${urls.length} file(s)`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload files" });
  }
});

export default router;
