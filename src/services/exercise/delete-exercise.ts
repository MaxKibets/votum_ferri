import {
  deleteExerciseById,
  getAuthUser,
  getExerciseById,
  getTrainingById,
} from "@/data";
import { err, ok } from "@/services/utils";

export async function deleteExerciseService(
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

    const { data: exercise, error: exerciseError } = await getExerciseById({
      trainingId,
      exerciseId,
    });

    if (exerciseError) {
      return err({ reason: "EXERCISE_FETCH_ERROR" });
    }

    if (!exercise) {
      return err({ reason: "NOT_FOUND" });
    }

    const { error: deleteError } = await deleteExerciseById({
      trainingId,
      exerciseId,
    });

    if (deleteError) {
      return err({ reason: "EXERCISE_DELETE_ERROR" });
    }

    return ok({ success: true });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
