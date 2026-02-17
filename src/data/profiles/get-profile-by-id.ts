import { createServerClient } from "@/lib/supabase";

export async function getProfileById(id: string) {
  const supabase = await createServerClient();

  return supabase
    .from("profiles")
    .select("id, email, name")
    .eq("id", id)
    .single();
}
