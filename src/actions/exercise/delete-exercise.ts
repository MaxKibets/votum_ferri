"use server";

import { revalidatePath } from "next/cache";
import { ROUTE } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import {
  actionErrorResponse,
  getAuthenticatedUserId,
  withActionError,
} from "../utils";

export async function deleteExercise(
  exerciseId: string,
): Promise<ActionResponse<{ exerciseId: string }>> {
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

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId)
      .select("id");

    if (error) {
      return actionErrorResponse(ACTION_ERROR_CODES.EXERCISE, { error });
    }

    if (!data || data.length === 0) {
      return actionErrorResponse(ACTION_ERROR_CODES.NOT_FOUND);
    }

    revalidatePath(ROUTE.DASHBOARD);

    return {
      data: { exerciseId },
      error: null,
    };
  });
}
