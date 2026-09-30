import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. It uses the service role key, which bypasses RLS, so it must
 * never reach the browser: the env vars are not NEXT_PUBLIC_ and nothing client-side imports this.
 * RLS still protects the table from anyone holding the public anon key.
 */
let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseClient() is server-only");
  }
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
