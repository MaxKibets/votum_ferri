import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types/exercise";
import { type ExerciseRow, mapExercise } from "../utils";
import { EXERCISE_SELECT_WITH_SETS } from "./constants";

export async function fetchExerciseById(
  exerciseId: string,
): Promise<Exercise | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(EXERCISE_SELECT_WITH_SETS)
    .eq("id", exerciseId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapExercise(data as ExerciseRow);
}
