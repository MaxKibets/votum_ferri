"use server";

import { revalidatePath } from "next/cache";
import { err, ok } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { updateTrainingService } from "@/services";
import type { UpdateTrainingDTO } from "@/types";

export async function updateTraining(id: string, data: UpdateTrainingDTO) {
  const [error, serviceData] = await updateTrainingService(id, data);

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
      case "TRAINING_UPDATE_ERROR":
        return err("Failed to update training");
      case "EXERCISE_DELETE_ERROR":
        return err("Failed to replace exercises");
      case "EXERCISE_CREATE_ERROR":
        return err("Failed to create exercise");
      case "EXERCISE_SET_CREATE_ERROR":
        return err("Failed to create exercise set");
      case "UNKNOWN_ERROR":
        return err("An unknown error occurred. Please try again later");
      default:
        throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }

  revalidatePath(ROUTE.DASHBOARD);
  revalidatePath(`/training/${id}`);

  return ok(serviceData);
}
