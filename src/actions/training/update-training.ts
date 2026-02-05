"use server";

import { revalidatePath } from "next/cache";
import { ROUTE } from "@/constants/routes";
import { UPDATE_TRAINING_SCHEMA } from "@/constants/trainingValidationSchemas";
import { createClient } from "@/lib/supabase/server";
import type { Training, UpdateTrainingDTO } from "@/types/training";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";
import { fetchTrainingById } from "./utils";

export async function updateTraining(
  trainingId: string,
  input: UpdateTrainingDTO,
): Promise<ActionResponse<{ training: Training }>> {
  return withActionError(async () => {
    if (!trainingId) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        message: "Training id is required",
      });
    }

    const { success, error, data } = UPDATE_TRAINING_SCHEMA.safeParse(input);

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
      date?: string;
      name?: string | null;
      description?: string | null;
    } = {};

    if (data.date !== undefined) {
      updatePayload.date = data.date;
    }
    if (data.name !== undefined) {
      updatePayload.name = data.name ?? null;
    }
    if (data.description !== undefined) {
      updatePayload.description = data.description ?? null;
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await supabase
        .from("trainings")
        .update(updatePayload)
        .eq("id", trainingId)
        .eq("user_id", userId);

      if (updateError) {
        return actionErrorResponse(ACTION_ERROR_CODES.TRAINING, {
          error: updateError,
        });
      }
    }

    if (data.exercises) {
      const { error: deleteError } = await supabase
        .from("exercises")
        .delete()
        .eq("training_id", trainingId);

      if (deleteError) {
        return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, {
          error: deleteError,
        });
      }

      for (const exercise of data.exercises) {
        const { data: exerciseRow, error: exerciseError } = await supabase
          .from("exercises")
          .insert({
            training_id: trainingId,
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
    }

    const training = await fetchTrainingById(trainingId, userId);
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
