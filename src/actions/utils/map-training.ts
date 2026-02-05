import type { Training } from "@/types/training";
import type { TrainingRow } from "../types";
import { mapExercise } from "./map-exercise";

export function mapTraining(row: TrainingRow): Training {
  const exercises = (row.exercises ?? [])
    .map((exercise) => mapExercise(exercise))
    .sort((a, b) => a.order - b.order);

  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    name: row.name ?? undefined,
    description: row.description ?? undefined,
    exercises,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
