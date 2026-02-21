import { createClient } from "@supabase/supabase-js";
import { env, supabaseServerKey } from "./env.js";

export const supabaseServer = createClient(env.SUPABASE_URL, supabaseServerKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
