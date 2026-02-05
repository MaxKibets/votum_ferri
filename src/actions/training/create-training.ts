"use server";

import { revalidatePath } from "next/cache";
import { ROUTE } from "@/constants/routes";
import { CREATE_TRAINING_SCHEMA } from "@/constants/trainingValidationSchemas";
import { createClient } from "@/lib/supabase/server";
import type { CreateTrainingDTO, Training } from "@/types/training";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";
import { fetchTrainingById } from "./utils";

export async function createTraining(
  input: CreateTrainingDTO,
): Promise<ActionResponse<{ training: Training }>> {
  return withActionError(async () => {
    const { success, error, data } = CREATE_TRAINING_SCHEMA.safeParse(input);

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
    const { data: trainingRow, error: trainingError } = await supabase
      .from("trainings")
      .insert({
        user_id: userId,
        date: data.date,
        name: data.name ?? null,
        description: data.description ?? null,
      })
      .select("id")
      .single();

    if (trainingError || !trainingRow) {
      return actionErrorResponse(ACTION_ERROR_CODES.TRAINING, {
        error: trainingError ?? undefined,
      });
    }

    for (const exercise of data.exercises) {
      const { data: exerciseRow, error: exerciseError } = await supabase
        .from("exercises")
        .insert({
          training_id: trainingRow.id,
          name: exercise.name,
          order_number: exercise.order,
          notes: exercise.notes ?? null,
        })
        .select("id")
        .single();

      if (exerciseError || !exerciseRow) {
        return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, {
          error: exerciseError ?? undefined,
        });
      }

      if (exercise.sets.length > 0) {
        const setsPayload = exercise.sets.map((set) => ({
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
    }

    const training = await fetchTrainingById(trainingRow.id, userId);
    if (!training) {
      return actionErrorResponse(ACTION_ERROR_CODES.NOT_FOUND);
    }

    revalidatePath(ROUTE.DASHBOARD);

    return {
      data: { training },
      error: null,
    };
  });
}
