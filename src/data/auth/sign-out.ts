import { createServerClient } from "@/lib/supabase";

export async function signOut() {
  const supabase = await createServerClient();

  return supabase.auth.signOut();
}
