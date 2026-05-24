import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/internal/types";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Service-role Supabase client for cron jobs and server-only admin operations.
 * Never expose this client to the browser.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin client"
    );
  }

  if (!adminClient) {
    adminClient = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
