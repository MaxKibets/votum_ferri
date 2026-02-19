import {
  createExercise,
  createExerciseSet,
  createTraining,
  getAuthUser,
  getTrainingById,
} from "@/data";
import { CREATE_TRAINING_SCHEMA } from "@/schemas";
import { err, ok } from "@/services/utils";
import type { TrainingRow } from "./types";
import { mapTrainingResponse } from "./utils";

export async function createTrainingService(input: unknown) {
  const parsed = CREATE_TRAINING_SCHEMA.safeParse(input);

  if (!parsed.success) {
    return err({ reason: "VALIDATION_ERROR", details: parsed.error.issues[0] });
  }

  try {
    const { data: authData, error: authError } = await getAuthUser();
    const user = authData?.user;

    if (authError || !user) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data: createdTraining, error: createTrainingError } =
      await createTraining({
        userId: user.id,
        date: parsed.data.date,
        name: parsed.data.name,
        description: parsed.data.description,
      });

    if (createTrainingError || !createdTraining) {
      return err({ reason: "TRAINING_CREATE_ERROR" });
    }

    for (const exercise of parsed.data.exercises) {
      const { data: createdExercise, error: createExerciseError } =
        await createExercise({
          trainingId: createdTraining.id,
          name: exercise.name,
          order: exercise.order,
          notes: exercise.notes,
        });

      if (createExerciseError || !createdExercise) {
        return err({ reason: "EXERCISE_CREATE_ERROR" });
      }

      for (const set of exercise.sets) {
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
    }

    const { data: trainingWithExercises, error: fetchTrainingError } =
      await getTrainingById({
        id: createdTraining.id,
        userId: user.id,
      });

    if (fetchTrainingError || !trainingWithExercises) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    return ok({
      training: mapTrainingResponse(trainingWithExercises as TrainingRow),
    });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
