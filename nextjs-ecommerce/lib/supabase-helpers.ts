// Supabase Helper Functions
// Các utility functions để làm việc với Supabase

import { supabaseServer } from './supabase-server';
import { supabase } from './supabase-client';

/**
 * Fetch products từ Supabase
 * Có thể dùng song song với Prisma
 */
export async function fetchProductsFromSupabase() {
  try {
    const { data, error } = await supabaseServer
      .from('Product')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase fetch products error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }
}

/**
 * Fetch categories từ Supabase
 */
export async function fetchCategoriesFromSupabase() {
  try {
    const { data, error } = await supabaseServer
      .from('Category')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase fetch categories error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    return [];
  }
}

/**
 * Fetch single product by ID
 */
export async function fetchProductByIdFromSupabase(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('Product')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch product error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product from Supabase:', error);
    return null;
  }
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFileToSupabase(
  bucket: string,
  path: string,
  file: File
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { error: error.message, data: null };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { data: { ...data, publicUrl }, error: null };
  } catch (error: any) {
    console.error('Error uploading to Supabase:', error);
    return { error: error.message, data: null };
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFileFromSupabase(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Supabase delete error:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting from Supabase:', error);
    return { error: error.message };
  }
}

/**
 * Realtime subscription for products
 * Client-side only
 */
export function subscribeToProducts(
  callback: (payload: any) => void
) {
  if (typeof window === 'undefined') {
    console.warn('Realtime subscriptions only work on client-side');
    return null;
  }

  const subscription = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Product',
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Unsubscribe from realtime
 */
export function unsubscribeFromChannel(subscription: any) {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
}

