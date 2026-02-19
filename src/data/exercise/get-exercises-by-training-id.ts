import { createServerClient } from "@/lib/supabase";

export async function getExercisesByTrainingId(trainingId: string) {
  const supabase = await createServerClient();

  return supabase
    .from("exercises")
    .select(
      "id, training_id, name, order_number, notes, created_at, updated_at, exercise_sets(id, exercise_id, set_number, reps, weight, rest_time, completed, notes, created_at, updated_at)",
    )
    .eq("training_id", trainingId);
}
