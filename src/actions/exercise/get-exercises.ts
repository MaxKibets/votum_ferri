"use server";

import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types/exercise";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  type ExerciseRow,
  getAuthenticatedUserId,
  mapExercise,
  withActionError,
} from "../utils";
import { EXERCISE_SELECT_WITH_SETS } from "./constants";

export async function getExercises(
  trainingId: string,
): Promise<ActionResponse<{ exercises: Exercise[] }>> {
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

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exercises")
      .select(EXERCISE_SELECT_WITH_SETS)
      .eq("training_id", trainingId)
      .order("order_number", { ascending: true });

    if (error) {
      return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, { error });
    }

    const exercises = (data ?? []).map((row) =>
      mapExercise(row as ExerciseRow),
    );

    return {
      data: { exercises },
      error: null,
    };
  });
}
