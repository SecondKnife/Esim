import { Category, Product } from "@/types";
import { productAPI, categoryAPI } from "./api-client";

// Client-side API calls using backend server
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const product = await productAPI.getById(productId) as Product | null;
    return product;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
}

export async function getCategoryProducts(category: string): Promise<Product[]> {
  try {
    const products = await productAPI.getByCategory(category) as Product[];
    return products || [];
  } catch (error) {
    console.error("Error getting category products:", error);
    return [];
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await categoryAPI.getAll() as Category[];
    return categories || [];
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

export const getCategory = async (category: string): Promise<Category[]> => {
  try {
    const categories = await categoryAPI.getAll() as Category[];
    return categories.filter((cat: Category) => cat.id === category) || [];
  } catch (error) {
    console.error("Error getting category:", error);
    return [];
  }
};

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await productAPI.getAll() as Product[];
    return products || [];
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await productAPI.getAll() as Product[];
    return products.filter((product: Product) => product.featured) || [];
  } catch (error) {
    console.error("Error getting featured products:", error);
    return [];
  }
}
