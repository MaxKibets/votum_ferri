"use server";

import { revalidatePath } from "next/cache";
import { err, ok } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { createTrainingService } from "@/services";
import type { CreateTrainingDTO } from "@/types";

export async function createTraining(data: CreateTrainingDTO) {
  const [error, serviceData] = await createTrainingService(data);

  if (error) {
    const details = "details" in error ? error.details : undefined;
    const { reason } = error;

    switch (reason) {
      case "VALIDATION_ERROR":
        return err("Validation failed", details);
      case "UNAUTHORIZED":
        return err("Not authenticated");
      case "TRAINING_CREATE_ERROR":
        return err("Failed to create training");
      case "EXERCISE_CREATE_ERROR":
        return err("Failed to create exercise");
      case "EXERCISE_SET_CREATE_ERROR":
        return err("Failed to create exercise set");
      case "TRAINING_FETCH_ERROR":
        return err("Failed to fetch created training");
      case "UNKNOWN_ERROR":
        return err("An unknown error occurred. Please try again later");
      default:
        throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }

  revalidatePath(ROUTE.DASHBOARD);

  return ok(serviceData);
}
