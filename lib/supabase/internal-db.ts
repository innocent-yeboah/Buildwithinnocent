import { cache } from "react";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Server-only data access for /internal routes.
 * Middleware already verifies the user; admin client avoids auth-token lock races
 * between middleware, RSC, and the browser client on the same page load.
 */
export const getInternalDb = cache(() => getSupabaseAdmin());
