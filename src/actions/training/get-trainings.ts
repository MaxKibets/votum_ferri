"use server";

import { err, ok } from "@/actions/utils";
import { getTrainingsService } from "@/services";
import type { GetTrainingsParams } from "@/types";

export async function getTrainings(params?: GetTrainingsParams) {
  const [error, data] = await getTrainingsService(params);

  if (error) {
    const details = "details" in error ? error.details : undefined;
    const { reason } = error;

    switch (reason) {
      case "VALIDATION_ERROR":
        return err("Validation failed", details);
      case "UNAUTHORIZED":
        return err("Not authenticated");
      case "TRAINING_FETCH_ERROR":
        return err("Failed to fetch trainings");
      case "UNKNOWN_ERROR":
        return err("An unknown error occurred. Please try again later");
      default:
        throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }

  return ok(data);
}
