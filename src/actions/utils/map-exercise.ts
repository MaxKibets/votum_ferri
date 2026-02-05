import type { Exercise } from "@/types/exercise";
import type { ExerciseRow } from "../types";
import { mapExerciseSet } from "./map-exercise-set";

export function mapExercise(row: ExerciseRow): Exercise {
  const sets = (row.exercise_sets ?? [])
    .map(mapExerciseSet)
    .sort((a, b) => a.setNumber - b.setNumber);

  return {
    id: row.id,
    trainingId: row.training_id,
    name: row.name,
    order: row.order_number,
    notes: row.notes ?? undefined,
    sets,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
