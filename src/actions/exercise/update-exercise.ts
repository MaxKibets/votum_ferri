"use server";

import { revalidatePath } from "next/cache";
import { err, ok } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { updateExerciseService } from "@/services";
import type { CreateExerciseDTO } from "@/types";

export async function updateExercise(
  trainingId: string,
  exerciseId: string,
  data: Partial<CreateExerciseDTO>,
) {
  const [error, serviceData] = await updateExerciseService(
    trainingId,
    exerciseId,
    data,
  );

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
      case "EXERCISE_UPDATE_ERROR":
        return err("Failed to update exercise");
      case "EXERCISE_SET_DELETE_ERROR":
        return err("Failed to replace exercise sets");
      case "EXERCISE_SET_CREATE_ERROR":
        return err("Failed to create exercise set");
      case "UNKNOWN_ERROR":
        return err("An unknown error occurred. Please try again later");
      default:
        throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }

  revalidatePath(ROUTE.DASHBOARD);
  revalidatePath(`/training/${trainingId}`);

  return ok(serviceData);
}
