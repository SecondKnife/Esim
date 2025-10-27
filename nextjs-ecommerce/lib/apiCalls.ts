import { Category, Product } from "@/types";
import { db } from "./db";

export async function getProduct(productId: string) {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });
    return product;
  } catch (error) {
    throw new Error("Error getting product");
  }
}

export async function getCategoryProducts(category: string) {
  try {
    const products = await db.product.findMany({
      where: { category },
    });
    return products;
  } catch (error) {
    throw new Error("Error getting category products");
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await db.category.findMany();
    return categories;
  } catch (error) {
    throw new Error("Error getting categories");
  }
};

export const getCategory = async (category: string): Promise<Category[]> => {
  try {
    const categories = await db.category.findMany({
      where: { id: category },
    });
    return categories;
  } catch (error) {
    throw new Error("Error getting category");
  }
};

export async function getAllProducts() {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    throw new Error("Error getting products");
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: { featured: true },
    });
    return products;
  } catch (error) {
    throw new Error("Error getting featured products");
  }
}
