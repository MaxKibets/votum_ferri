import { createServerClient } from "@/lib/supabase";

export async function deleteExerciseById({
  trainingId,
  exerciseId,
}: {
  trainingId: string;
  exerciseId: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("exercises")
    .delete()
    .eq("id", exerciseId)
    .eq("training_id", trainingId);
}
