import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Lightweight Supabase client for use inside generateStaticParams()
 * where Next.js has no incoming request context (no cookies needed).
 * Uses the anon key — only public tables are read.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
