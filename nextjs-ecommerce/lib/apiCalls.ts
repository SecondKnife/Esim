import { Category, Product } from "@/types";
import { db } from "./db";

// Check if we're in build mode (no database available)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

export async function getProduct(productId: string) {
  // Skip database calls during build time
  if (isBuildTime) {
    return null;
  }
  
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });
    return product;
  } catch (error) {
    console.error("Error getting product:", error);
    return null; // Return null instead of throwing during build
  }
}

export async function getCategoryProducts(category: string) {
  // Skip database calls during build time
  if (isBuildTime) {
    return [];
  }
  
  try {
    const products = await db.product.findMany({
      where: { category },
    });
    return products;
  } catch (error) {
    console.error("Error getting category products:", error);
    return []; // Return empty array instead of throwing during build
  }
}

export const getCategories = async (): Promise<Category[]> => {
  // Skip database calls during build time
  if (isBuildTime) {
    return [];
  }
  
  try {
    const categories = await db.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return []; // Return empty array instead of throwing during build
  }
};

export const getCategory = async (category: string): Promise<Category[]> => {
  // Skip database calls during build time
  if (isBuildTime) {
    return [];
  }
  
  try {
    const categories = await db.category.findMany({
      where: { id: category },
    });
    return categories;
  } catch (error) {
    console.error("Error getting category:", error);
    return []; // Return empty array instead of throwing during build
  }
};

export async function getAllProducts() {
  // Skip database calls during build time
  if (isBuildTime) {
    return [];
  }
  
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return []; // Return empty array instead of throwing during build
  }
}

export async function getFeaturedProducts() {
  // Skip database calls during build time
  if (isBuildTime) {
    return [];
  }
  
  try {
    const products = await db.product.findMany({
      where: { featured: true },
    });
    return products;
  } catch (error) {
    console.error("Error getting featured products:", error);
    return []; // Return empty array instead of throwing during build
  }
}
