import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Plain anon client — no auth or cookie handling needed.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
