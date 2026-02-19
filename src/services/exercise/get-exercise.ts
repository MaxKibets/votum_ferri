import { getAuthUser, getExerciseById, getTrainingById } from "@/data";
import { err, ok } from "@/services/utils";
import type { ExerciseRow } from "./types";
import { mapExerciseResponse } from "./utils";

export async function getExerciseService(
  trainingId: string,
  exerciseId: string,
) {
  if (!trainingId || !exerciseId) {
    return err({ reason: "VALIDATION_ERROR" });
  }

  try {
    const { data: authData, error: authError } = await getAuthUser();
    const user = authData?.user;

    if (authError || !user) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data: training, error: trainingError } = await getTrainingById({
      id: trainingId,
      userId: user.id,
    });

    if (trainingError) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    if (!training) {
      return err({ reason: "NOT_FOUND" });
    }

    const { data, error } = await getExerciseById({ trainingId, exerciseId });

    if (error) {
      return err({ reason: "EXERCISE_FETCH_ERROR" });
    }

    if (!data) {
      return err({ reason: "NOT_FOUND" });
    }

    return ok({ exercise: mapExerciseResponse(data as ExerciseRow) });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
