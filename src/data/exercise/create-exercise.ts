import { createServerClient } from "@/lib/supabase";

export async function createExercise({
  trainingId,
  name,
  order,
  notes,
}: {
  trainingId: string;
  name: string;
  order: number;
  notes?: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("exercises")
    .insert({
      training_id: trainingId,
      name,
      order_number: order,
      notes: notes ?? null,
    })
    .select(
      "id, training_id, name, order_number, notes, created_at, updated_at",
    )
    .single();
}
