import type { ExerciseResponse, ExerciseSetResponse } from "@/types";
import type { ExerciseRow } from "./types";

export function mapExerciseResponse(exercise: ExerciseRow): ExerciseResponse {
  const sets: ExerciseSetResponse[] = (exercise.exercise_sets ?? [])
    .map((set) => ({
      id: set.id,
      exerciseId: set.exercise_id,
      setNumber: set.set_number,
      reps: set.reps,
      weight: set.weight,
      restTime: set.rest_time ?? undefined,
      completed: set.completed ?? undefined,
      notes: set.notes ?? undefined,
      createdAt: set.created_at,
      updatedAt: set.updated_at,
    }))
    .sort((a, b) => a.setNumber - b.setNumber);

  return {
    id: exercise.id,
    trainingId: exercise.training_id,
    name: exercise.name,
    sets,
    order: exercise.order_number,
    notes: exercise.notes ?? undefined,
    createdAt: exercise.created_at,
    updatedAt: exercise.updated_at,
  };
}
