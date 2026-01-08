'use client';

import { useState, useEffect } from 'react';
import { productAPI } from '@/lib/api-client';

export interface SupabaseProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURLs: string;
  category: string;
  categoryId: string;
  featured: boolean;
  discount?: number | null;
  finalPrice?: number | null;
  country?: string | null;
  region?: string | null;
  dataPlan?: string | null;
  validityDays?: number | null;
  simType?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook client-side để fetch danh sách products từ API `/api/product`
 * (Không còn phụ thuộc Supabase phía client, tránh lỗi policy/RLS)
 */
export function useSupabaseProducts() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data từ API
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await productAPI.getAll();
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

/**
 * Hook để fetch featured products
 */
export function useSupabaseFeaturedProducts() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true);
        const data = await productAPI.getAll();
        const featured = (Array.isArray(data) ? data : []).filter((p: any) => p.featured);
        setProducts(featured);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
}

