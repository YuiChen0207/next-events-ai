import { createClient } from "@/lib/supabase/client";

export async function logoutClient() {
  const supabase = createClient();
  return supabase.auth.signOut(); //回傳 {error: null}
}

export default logoutClient;
