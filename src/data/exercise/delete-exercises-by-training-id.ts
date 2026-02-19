import { createServerClient } from "@/lib/supabase";

export async function deleteExercisesByTrainingId(trainingId: string) {
  const supabase = await createServerClient();

  return supabase.from("exercises").delete().eq("training_id", trainingId);
}
