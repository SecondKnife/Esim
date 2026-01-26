/**
 * Cloudflare R2 URL Helper
 * Centralized place to manage all R2 image URLs
 */

// R2 Base URL từ environment variable
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
 * Normalize image URL - convert S3 URLs to R2 URLs or handle relative paths
 * @param imageUrl Image URL from database (could be S3 URL, R2 URL, or relative path)
 * @returns Normalized R2 URL
 */
export const normalizeImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return R2_IMAGES.PLACEHOLDER;
  }

  // Base64 image (from old upload method)
  if (imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }

  // Already a full URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    // If it's an S3 URL, try to convert to R2 URL
    if (imageUrl.includes("kemal-web-storage.s3.eu-north-1.amazonaws.com")) {
      // Extract path from S3 URL and convert to R2 URL
      const url = new URL(imageUrl);
      const path = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
      return `${R2_BASE_URL}/${path}`;
    }
    // If it's already an R2 URL or other external URL, return as-is
    return imageUrl;
  }

  // Relative path - prepend R2 base URL
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  return `${R2_BASE_URL}/${cleanPath}`;
};

