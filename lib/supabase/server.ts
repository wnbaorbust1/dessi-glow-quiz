/**
 * Server-side Supabase client — uses the service-role key.
 * NEVER import this in client components or expose SUPABASE_SERVICE_ROLE_KEY
 * via NEXT_PUBLIC_* variables.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = ReturnType<typeof createClient<any, any, any>>;

export function getSupabaseServer(): AnyClient | null {
  if (!supabaseUrl || !serviceRoleKey) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
