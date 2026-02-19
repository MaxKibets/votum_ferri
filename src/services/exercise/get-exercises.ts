import { getAuthUser, getExercisesByTrainingId, getTrainingById } from "@/data";
import { err, ok } from "@/services/utils";
import type { ExerciseRow } from "./types";
import { mapExerciseResponse } from "./utils";

export async function getExercisesService(trainingId: string) {
  if (!trainingId) {
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

    const { data, error } = await getExercisesByTrainingId(trainingId);

    if (error) {
      return err({ reason: "EXERCISE_FETCH_ERROR" });
    }

    const exercises =
      (data as ExerciseRow[] | null)
        ?.map(mapExerciseResponse)
        .sort((a, b) => a.order - b.order) ?? [];

    return ok({ exercises });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
