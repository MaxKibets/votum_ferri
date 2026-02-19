import { mapExerciseResponse } from "@/services/exercise/utils";
import type { TrainingResponse } from "@/types";
import type { TrainingRow } from "./types";

export function mapTrainingResponse(training: TrainingRow): TrainingResponse {
  const exercises = (training.exercises ?? [])
    .map(mapExerciseResponse)
    .sort((a, b) => a.order - b.order);

  return {
    id: training.id,
    userId: training.user_id,
    date: training.date,
    name: training.name ?? undefined,
    description: training.description ?? undefined,
    exercises,
    createdAt: training.created_at,
    updatedAt: training.updated_at,
  };
}
