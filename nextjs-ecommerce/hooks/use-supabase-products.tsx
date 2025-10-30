'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { subscribeToProducts, unsubscribeFromChannel } from '@/lib/supabase-helpers';

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
 * Hook để fetch và realtime updates cho products từ Supabase
 */
export function useSupabaseProducts() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Product')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setError(error.message);
        } else {
          setProducts(data || []);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // Subscribe to realtime changes
    const subscription = subscribeToProducts((payload) => {
      console.log('Product changed:', payload);

      if (payload.eventType === 'INSERT') {
        setProducts((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.new.id ? payload.new : p))
        );
      } else if (payload.eventType === 'DELETE') {
        setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
      }
    });

    // Cleanup
    return () => {
      if (subscription) {
        unsubscribeFromChannel(subscription);
      }
    };
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
        const { data, error } = await supabase
          .from('Product')
          .select('*')
          .eq('featured', true)
          .order('createdAt', { ascending: false });

        if (error) {
          console.error('Error fetching featured products:', error);
          setError(error.message);
        } else {
          setProducts(data || []);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
}

