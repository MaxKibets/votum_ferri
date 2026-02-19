import {
  createExercise,
  createExerciseSet,
  getAuthUser,
  getExerciseById,
  getTrainingById,
} from "@/data";
import { CREATE_EXERCISE_SCHEMA } from "@/schemas";
import { err, ok } from "@/services/utils";
import type { ExerciseRow } from "./types";
import { mapExerciseResponse } from "./utils";

export async function createExerciseService(
  trainingId: string,
  input: unknown,
) {
  if (!trainingId) {
    return err({ reason: "VALIDATION_ERROR" });
  }

  const parsed = CREATE_EXERCISE_SCHEMA.safeParse(input);

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

    const { data: createdExercise, error: createExerciseError } =
      await createExercise({
        trainingId,
        name: parsed.data.name,
        order: parsed.data.order,
        notes: parsed.data.notes,
      });

    if (createExerciseError || !createdExercise) {
      return err({ reason: "EXERCISE_CREATE_ERROR" });
    }

    for (const set of parsed.data.sets) {
      const { error: createSetError } = await createExerciseSet({
        exerciseId: createdExercise.id,
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

    const { data: exerciseWithSets, error: fetchExerciseError } =
      await getExerciseById({
        trainingId,
        exerciseId: createdExercise.id,
      });

    if (fetchExerciseError || !exerciseWithSets) {
      return err({ reason: "EXERCISE_FETCH_ERROR" });
    }

    return ok({
      exercise: mapExerciseResponse(exerciseWithSets as ExerciseRow),
    });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
