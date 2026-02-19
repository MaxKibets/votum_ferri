import { createServerClient } from "@/lib/supabase";

export async function getTrainingById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("trainings")
    .select(
      "id, user_id, date, name, description, created_at, updated_at, exercises(id, training_id, name, order_number, notes, created_at, updated_at, exercise_sets(id, exercise_id, set_number, reps, weight, rest_time, completed, notes, created_at, updated_at))",
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();
}
