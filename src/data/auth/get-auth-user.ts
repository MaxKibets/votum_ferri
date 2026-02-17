import { createServerClient } from "@/lib/supabase";

export async function getAuthUser() {
  const supabase = await createServerClient();

  return supabase.auth.getUser();
}
