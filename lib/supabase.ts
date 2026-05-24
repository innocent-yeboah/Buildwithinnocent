export { createClient as createBrowserClient } from "@/lib/supabase/client";
export { createClient as createServerClient } from "@/lib/supabase/server";
export { getSupabaseAdmin } from "@/lib/supabase/admin";

/** @deprecated Use createServerClient or getSupabaseAdmin. Kept for legacy website API. */
export { getSupabase } from "@/lib/supabase-legacy";
