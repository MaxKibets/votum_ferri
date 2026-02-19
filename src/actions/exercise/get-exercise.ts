"use server";

import { err, ok } from "@/actions/utils";
import { getExerciseService } from "@/services";

export async function getExercise(trainingId: string, exerciseId: string) {
  const [error, data] = await getExerciseService(trainingId, exerciseId);

  if (error) {
    const details = "details" in error ? error.details : undefined;
    const { reason } = error;

    switch (reason) {
      case "VALIDATION_ERROR":
        return err("Validation failed", details);
      case "UNAUTHORIZED":
        return err("Not authenticated");
      case "NOT_FOUND":
        return err("Exercise not found");
      case "TRAINING_FETCH_ERROR":
        return err("Failed to fetch training");
      case "EXERCISE_FETCH_ERROR":
        return err("Failed to fetch exercise");
      case "UNKNOWN_ERROR":
        return err("An unknown error occurred. Please try again later");
      default:
        throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }

  return ok(data);
}
