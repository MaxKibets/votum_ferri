"use server";

import { TRAINING_DATE_RANGE_SCHEMA } from "@/constants/trainingValidationSchemas";
import { createClient } from "@/lib/supabase/server";
import type { Training } from "@/types/training";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  mapTraining,
  type TrainingRow,
  withActionError,
} from "../utils";
import { TRAINING_SELECT_WITH_EXERCISES } from "./constants";

export async function getTrainings(
  startDate?: string,
  endDate?: string,
): Promise<ActionResponse<{ trainings: Training[] }>> {
  return withActionError(async () => {
    const { success, error, data } = TRAINING_DATE_RANGE_SCHEMA.safeParse({
      startDate,
      endDate,
    });

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
    let query = supabase
      .from("trainings")
      .select(TRAINING_SELECT_WITH_EXERCISES)
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (data.startDate) {
      query = query.gte("date", data.startDate);
    }

    if (data.endDate) {
      query = query.lte("date", data.endDate);
    }

    const { data: trainings, error: trainingsError } = await query;

    if (trainingsError) {
      return actionErrorResponse(ACTION_ERROR_CODES.TRAINING, {
        error: trainingsError,
      });
    }

    const mappedTrainings = (trainings ?? []).map((row) =>
      mapTraining(row as TrainingRow),
    );

    return {
      data: { trainings: mappedTrainings },
      error: null,
    };
  });
}
