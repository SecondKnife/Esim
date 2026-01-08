import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
// Sử dụng cho API routes và Server Components

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Some features may not work.');
}

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Don't persist session on server
    autoRefreshToken: false,
  },
});

// Helper function to get Supabase client with custom auth
export function getSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey);
}

