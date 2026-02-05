"use server";

import type { Training } from "@/types/training";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";
import { fetchTrainingById } from "./utils";

export async function getTraining(
  trainingId: string,
): Promise<ActionResponse<{ training: Training }>> {
  return withActionError(async () => {
    if (!trainingId) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        message: "Training id is required",
      });
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return actionErrorResponse(ACTION_ERROR_CODES.UNAUTHORIZED);
    }

    const training = await fetchTrainingById(trainingId, userId);
    if (!training) {
      return actionErrorResponse(ACTION_ERROR_CODES.NOT_FOUND);
    }

    return {
      data: { training },
      error: null,
    };
  });
}
