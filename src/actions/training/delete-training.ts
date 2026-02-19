"use server";

import { revalidatePath } from "next/cache";
import { err, ok } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { deleteTrainingService } from "@/services";

export async function deleteTraining(id: string) {
  const [error, data] = await deleteTrainingService(id);

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
      case "TRAINING_DELETE_ERROR":
        return err("Failed to delete training");
      case "UNKNOWN_ERROR":
        return err("An unknown error occurred. Please try again later");
      default:
        throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }

  revalidatePath(ROUTE.DASHBOARD);
  revalidatePath(`/training/${id}`);

  return ok(data);
}
