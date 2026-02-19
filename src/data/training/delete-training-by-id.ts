import { createServerClient } from "@/lib/supabase";

export async function deleteTrainingById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const supabase = await createServerClient();

  return supabase.from("trainings").delete().eq("id", id).eq("user_id", userId);
}
