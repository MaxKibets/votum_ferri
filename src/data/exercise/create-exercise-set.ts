import { createServerClient } from "@/lib/supabase";

export async function createExerciseSet({
  exerciseId,
  setNumber,
  reps,
  weight,
  restTime,
  notes,
}: {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;
}) {
  const supabase = await createServerClient();

  return supabase
    .from("exercise_sets")
    .insert({
      exercise_id: exerciseId,
      set_number: setNumber,
      reps,
      weight,
      rest_time: restTime ?? null,
      notes: notes ?? null,
    })
    .select(
      "id, exercise_id, set_number, reps, weight, rest_time, completed, notes, created_at, updated_at",
    )
    .single();
}
