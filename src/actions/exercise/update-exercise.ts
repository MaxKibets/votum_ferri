"use server";

import { revalidatePath } from "next/cache";
import { ROUTE } from "@/constants/routes";
import { UPDATE_EXERCISE_SCHEMA } from "@/constants/trainingValidationSchemas";
import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types/exercise";
import type { UpdateExerciseDTO } from "@/types/training";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";
import { fetchExerciseById } from "./utils";

export async function updateExercise(
  exerciseId: string,
  input: UpdateExerciseDTO,
): Promise<ActionResponse<{ exercise: Exercise }>> {
  return withActionError(async () => {
    if (!exerciseId) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        message: "Exercise id is required",
      });
    }

    const { success, error, data } = UPDATE_EXERCISE_SCHEMA.safeParse(input);

    if (!success) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        issue: error.issues[0],
      });
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return actionErrorResponse(ACTION_ERROR_CODES.UNAUTHORIZED);
    }

    const supabase = await createClient();
    const updatePayload: {
      name?: string;
      order_number?: number;
      notes?: string | null;
    } = {};

    if (data.name !== undefined) {
      updatePayload.name = data.name;
    }
    if (data.order !== undefined) {
      updatePayload.order_number = data.order;
    }
    if (data.notes !== undefined) {
      updatePayload.notes = data.notes ?? null;
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await supabase
        .from("exercises")
        .update(updatePayload)
        .eq("id", exerciseId);

      if (updateError) {
        return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, {
          error: updateError,
        });
      }
    }

    if (data.sets) {
      const { error: deleteError } = await supabase
        .from("exercise_sets")
        .delete()
        .eq("exercise_id", exerciseId);

      if (deleteError) {
        return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, {
          error: deleteError,
        });
      }

      if (data.sets.length > 0) {
        const setsPayload = data.sets.map((set) => ({
          exercise_id: exerciseId,
          set_number: set.setNumber,
          reps: set.reps,
          weight: set.weight,
          rest_time: set.restTime ?? null,
          notes: set.notes ?? null,
        }));

        const { error: setsError } = await supabase
          .from("exercise_sets")
          .insert(setsPayload);

        if (setsError) {
          return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, {
            error: setsError,
          });
        }
      }
    }

    const exercise = await fetchExerciseById(exerciseId);
    if (!exercise) {
      return actionErrorResponse(ACTION_ERROR_CODES.NOT_FOUND);
    }

    revalidatePath(ROUTE.DASHBOARD);

    return {
      data: { exercise },
      error: null,
    };
  });
}
