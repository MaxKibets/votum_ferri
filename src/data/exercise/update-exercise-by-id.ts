import { createServerClient } from "@/lib/supabase";

export async function updateExerciseById({
  trainingId,
  exerciseId,
  name,
  order,
  notes,
}: {
  trainingId: string;
  exerciseId: string;
  name?: string;
  order?: number;
  notes?: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("exercises")
    .update({
      ...(name !== undefined ? { name } : {}),
      ...(order !== undefined ? { order_number: order } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", exerciseId)
    .eq("training_id", trainingId)
    .select(
      "id, training_id, name, order_number, notes, created_at, updated_at",
    )
    .single();
}
