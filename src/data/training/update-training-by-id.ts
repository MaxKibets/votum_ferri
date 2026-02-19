import { createServerClient } from "@/lib/supabase";

export async function updateTrainingById({
  id,
  userId,
  date,
  name,
  description,
}: {
  id: string;
  userId: string;
  date?: string;
  name?: string;
  description?: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("trainings")
    .update({
      ...(date ? { date } : {}),
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, user_id, date, name, description, created_at, updated_at")
    .single();
}
