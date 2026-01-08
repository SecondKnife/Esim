"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxFiles?: number;
  disabled?: boolean;
}

const ImageUpload = ({
  value = [],
  onChange,
  folder = "products",
  maxFiles = 5,
  disabled = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check max files
    if (value.length + files.length > maxFiles) {
      alert(`Chỉ được upload tối đa ${maxFiles} ảnh`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", folder);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange([...value, ...data.urls]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((v) => v !== url));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label
          htmlFor="image-upload"
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer ${
            disabled || uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload ảnh ({value.length}/{maxFiles})
            </>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          disabled={disabled || uploading}
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden border group"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(url)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Ảnh chính
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500">
        <p>• Ảnh đầu tiên sẽ là ảnh chính hiển thị</p>
        <p>• Kéo thả để sắp xếp lại thứ tự (coming soon)</p>
        <p>• Định dạng: JPG, PNG, WEBP</p>
        <p>• Kích thước khuyến nghị: 1000x1000px</p>
      </div>
    </div>
  );
};

export default ImageUpload;

