"use server";

import { revalidatePath } from "next/cache";
import { err, ok } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { createExerciseService } from "@/services";
import type { CreateExerciseDTO } from "@/types";

export async function createExercise(
  trainingId: string,
  data: CreateExerciseDTO,
) {
  const [error, serviceData] = await createExerciseService(trainingId, data);

  if (error) {
    const details = "details" in error ? error.details : undefined;
    const { reason } = error;

    switch (reason) {
      case "VALIDATION_ERROR":
        return err("Validation failed", details);
      case "UNAUTHORIZED":
        return err("Not authenticated");
      case "NOT_FOUND":
        return err("Training not found");
      case "TRAINING_FETCH_ERROR":
        return err("Failed to fetch training");
      case "EXERCISE_CREATE_ERROR":
        return err("Failed to create exercise");
      case "EXERCISE_SET_CREATE_ERROR":
        return err("Failed to create exercise set");
      case "EXERCISE_FETCH_ERROR":
        return err("Failed to fetch created exercise");
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
