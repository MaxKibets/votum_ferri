import type { ExerciseSet } from "@/types/exercise";
import type { ExerciseSetRow } from "../types";

export function mapExerciseSet(row: ExerciseSetRow): ExerciseSet {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    setNumber: row.set_number,
    reps: row.reps,
    weight: Number(row.weight),
    restTime: row.rest_time ?? undefined,
    completed: row.completed ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
