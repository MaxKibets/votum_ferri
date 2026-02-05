"use server";

import { revalidatePath } from "next/cache";
import { ROUTE } from "@/constants/routes";
import { CREATE_EXERCISE_SCHEMA } from "@/constants/trainingValidationSchemas";
import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types/exercise";
import type { CreateExerciseDTO } from "@/types/training";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";
import { fetchExerciseById } from "./utils";

export async function createExercise(
  trainingId: string,
  input: CreateExerciseDTO,
): Promise<ActionResponse<{ exercise: Exercise }>> {
  return withActionError(async () => {
    if (!trainingId) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        message: "Training id is required",
      });
    }

    const { success, error, data } = CREATE_EXERCISE_SCHEMA.safeParse(input);

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
    const { data: exerciseRow, error: exerciseError } = await supabase
      .from("exercises")
      .insert({
        training_id: trainingId,
        name: data.name,
        order_number: data.order,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();

    if (exerciseError || !exerciseRow) {
      return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, {
        error: exerciseError ?? undefined,
      });
    }

    if (data.sets.length > 0) {
      const setsPayload = data.sets.map((set) => ({
        exercise_id: exerciseRow.id,
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

    const exercise = await fetchExerciseById(exerciseRow.id);
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
