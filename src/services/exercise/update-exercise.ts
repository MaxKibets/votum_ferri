import {
  createExerciseSet,
  deleteExerciseSetsByExerciseId,
  getAuthUser,
  getExerciseById,
  getTrainingById,
  updateExerciseById,
} from "@/data";
import { UPDATE_EXERCISE_SCHEMA } from "@/schemas";
import { err, ok } from "@/services/utils";
import type { ExerciseRow } from "./types";
import { mapExerciseResponse } from "./utils";

export async function updateExerciseService(
  trainingId: string,
  exerciseId: string,
  input: unknown,
) {
  if (!trainingId || !exerciseId) {
    return err({ reason: "VALIDATION_ERROR" });
  }

  const parsed = UPDATE_EXERCISE_SCHEMA.safeParse(input);

  if (!parsed.success) {
    return err({ reason: "VALIDATION_ERROR", details: parsed.error.issues[0] });
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

    const { data: currentExercise, error: currentExerciseError } =
      await getExerciseById({
        trainingId,
        exerciseId,
      });

    if (currentExerciseError) {
      return err({ reason: "EXERCISE_FETCH_ERROR" });
    }

    if (!currentExercise) {
      return err({ reason: "NOT_FOUND" });
    }

    const { error: updateError } = await updateExerciseById({
      trainingId,
      exerciseId,
      name: parsed.data.name,
      order: parsed.data.order,
      notes: parsed.data.notes,
    });

    if (updateError) {
      return err({ reason: "EXERCISE_UPDATE_ERROR" });
    }

    if (parsed.data.sets) {
      const { error: deleteSetsError } =
        await deleteExerciseSetsByExerciseId(exerciseId);

      if (deleteSetsError) {
        return err({ reason: "EXERCISE_SET_DELETE_ERROR" });
      }

      for (const set of parsed.data.sets) {
        const { error: createSetError } = await createExerciseSet({
          exerciseId,
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
          restTime: set.restTime,
          notes: set.notes,
        });

        if (createSetError) {
          return err({ reason: "EXERCISE_SET_CREATE_ERROR" });
        }
      }
    }

    const { data: updatedExercise, error: updatedExerciseError } =
      await getExerciseById({
        trainingId,
        exerciseId,
      });

    if (updatedExerciseError || !updatedExercise) {
      return err({ reason: "EXERCISE_FETCH_ERROR" });
    }

    return ok({
      exercise: mapExerciseResponse(updatedExercise as ExerciseRow),
    });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
