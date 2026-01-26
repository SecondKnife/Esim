/**
 * Image URL Helper
 * Centralized place to manage all image URLs (VPS or R2)
 */

// VPS Base URL - use backend API URL for serving uploaded images
const getVPSBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // Auto-convert HTTP to HTTPS if site is running on HTTPS
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    if (apiUrl.startsWith("http://")) {
      return apiUrl.replace("http://", "https://");
    }
  }
  return apiUrl;
};

export const VPS_BASE_URL = getVPSBaseUrl();

// R2 Base URL từ environment variable (for backward compatibility)
export const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-e0e9acaddce04acebe10f6c2f0d53bb3.r2.dev";

/**
 * Get full R2 URL từ path
 * @param path Path trong bucket (vd: "banners/BannerMain.jpg")
 * @returns Full public URL
 */
export const getR2Url = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${R2_BASE_URL}/${cleanPath}`;
};

/**
 * Predefined image URLs
 */
export const R2_IMAGES = {
  // Banners
  BANNER_MAIN: getR2Url("banners/BannerMain.jpg"),
  BANNER_HERO: getR2Url("banners/hero.jpg"),
  
  // Categories / Countries
  THAILAND: getR2Url("categories/thailand.png"),
  SINGAPORE: getR2Url("categories/singapore.png"),
  USA: getR2Url("categories/usa.png"),
  JAPAN: getR2Url("categories/japan.png"),
  KOREA: getR2Url("categories/korea.png"),
  EUROPE: getR2Url("categories/europe.png"),
  AUSTRALIA: getR2Url("categories/australia.png"),
  ASIA: getR2Url("categories/asia.png"),
  
  // Placeholder
  PLACEHOLDER: getR2Url("placeholder.png"),
} as const;

/**
 * Get product image URL
 * @param productId Product ID
 * @param index Image index (0-based)
 * @returns Product image URL
 */
export const getProductImageUrl = (productId: string | number, index: number = 0): string => {
  return getR2Url(`products/${productId}_${index}.jpg`);
};

/**
 * Parse imageURLs string from database
 * @param imageURLs JSON string of image URLs
 * @returns Array of image URLs
 */
export const parseImageUrls = (imageURLs: string): string[] => {
  try {
    const urls = JSON.parse(imageURLs);
    return Array.isArray(urls) ? urls : [urls];
  } catch {
    return [R2_IMAGES.PLACEHOLDER];
  }
};

/**
 * Stringify image URLs for database
 * @param urls Array of image URLs
 * @returns JSON string
 */
export const stringifyImageUrls = (urls: string[]): string => {
  return JSON.stringify(urls);
};

/**
 * Normalize image URL - convert to VPS URLs
 * Priority: VPS URLs > R2 URLs > S3 URLs
 * @param imageUrl Image URL from database (could be S3 URL, R2 URL, VPS URL, or relative path)
 * @returns Normalized VPS URL (or original URL if already valid)
 */
export const normalizeImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    // Return placeholder from VPS if available, otherwise R2
    return `${VPS_BASE_URL}/uploads/placeholder.png`;
  }

  // Base64 image (from old upload method)
  if (imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }

  // Already a full URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    // If it's a VPS URL (already correct), return as-is
    if (imageUrl.includes("/uploads/") || imageUrl.includes(VPS_BASE_URL)) {
      return imageUrl;
    }
    
    // If it's an S3 URL, try to extract path and convert to VPS URL
    if (imageUrl.includes("kemal-web-storage.s3.eu-north-1.amazonaws.com")) {
      try {
        const url = new URL(imageUrl);
        const path = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
        // Convert S3 path to VPS uploads path
        // S3: categories/australia.png -> VPS: uploads/categories/australia.png
        return `${VPS_BASE_URL}/uploads/${path}`;
      } catch (e) {
        // If URL parsing fails, return original
        return imageUrl;
      }
    }
    
    // If it's an R2 URL, try to extract path and convert to VPS URL
    if (imageUrl.includes(".r2.dev") || imageUrl.includes("r2.cloudflarestorage.com")) {
      try {
        const url = new URL(imageUrl);
        let path = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
        
        // If path doesn't contain a folder (e.g., just "australia.png"),
        // try common folders: categories, products, billboards
        if (!path.includes("/")) {
          // Common country/category image names
          const countryImages = ["australia.png", "korea.png", "thailand.png", "singapore.png", 
                                 "usa.png", "japan.png", "europe.png", "asia.png"];
          if (countryImages.includes(path.toLowerCase())) {
            path = `categories/${path}`;
          } else {
            // Default to products folder for other images
            path = `products/${path}`;
          }
        }
        
        // Convert R2 path to VPS uploads path
        // R2: categories/australia.png -> VPS: uploads/categories/australia.png
        return `${VPS_BASE_URL}/uploads/${path}`;
      } catch (e) {
        // If URL parsing fails, return original
        return imageUrl;
      }
    }
    
    // If it's already a valid external URL (not S3/R2), return as-is
    return imageUrl;
  }

  // Relative path - prepend VPS base URL with /uploads/
  // Examples:
  // - "australia.png" -> "https://api.com/uploads/australia.png"
  // - "categories/australia.png" -> "https://api.com/uploads/categories/australia.png"
  // - "/categories/australia.png" -> "https://api.com/uploads/categories/australia.png"
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  
  // If path doesn't start with a folder name, assume it's in root uploads
  // Otherwise, use as-is
  return `${VPS_BASE_URL}/uploads/${cleanPath}`;
};

