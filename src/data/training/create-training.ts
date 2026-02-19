import { createServerClient } from "@/lib/supabase";

export async function createTraining({
  userId,
  date,
  name,
  description,
}: {
  userId: string;
  date: string;
  name?: string;
  description?: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("trainings")
    .insert({
      user_id: userId,
      date,
      name: name ?? null,
      description: description ?? null,
    })
    .select("id, user_id, date, name, description, created_at, updated_at")
    .single();
}
