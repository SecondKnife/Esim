import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
// Sử dụng cho Client Components và React hooks

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found in environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper to check if client is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Export for type safety
export type SupabaseClient = typeof supabase;

