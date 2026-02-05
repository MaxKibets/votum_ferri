"use server";

import type { Exercise } from "@/types/exercise";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";
import { fetchExerciseById } from "./utils";

export async function getExercise(
  exerciseId: string,
): Promise<ActionResponse<{ exercise: Exercise }>> {
  return withActionError(async () => {
    if (!exerciseId) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        message: "Exercise id is required",
      });
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return actionErrorResponse(ACTION_ERROR_CODES.UNAUTHORIZED);
    }

    const exercise = await fetchExerciseById(exerciseId);
    if (!exercise) {
      return actionErrorResponse(ACTION_ERROR_CODES.NOT_FOUND);
    }

    return {
      data: { exercise },
      error: null,
    };
  });
}
