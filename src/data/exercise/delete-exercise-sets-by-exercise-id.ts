import { createServerClient } from "@/lib/supabase";

export async function deleteExerciseSetsByExerciseId(exerciseId: string) {
  const supabase = await createServerClient();

  return supabase.from("exercise_sets").delete().eq("exercise_id", exerciseId);
}
