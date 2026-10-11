import { createClient } from "@supabase/supabase-js";

export const supabaseAdminClient=createClient(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)