import {
  createExercise,
  createExerciseSet,
  deleteExercisesByTrainingId,
  getAuthUser,
  getTrainingById,
  updateTrainingById,
} from "@/data";
import { UPDATE_TRAINING_SCHEMA } from "@/schemas";
import { err, ok } from "@/services/utils";
import type { TrainingRow } from "./types";
import { mapTrainingResponse } from "./utils";

export async function updateTrainingService(id: string, input: unknown) {
  if (!id) {
    return err({ reason: "VALIDATION_ERROR" });
  }

  const parsed = UPDATE_TRAINING_SCHEMA.safeParse(input);

  if (!parsed.success) {
    return err({ reason: "VALIDATION_ERROR", details: parsed.error.issues[0] });
  }

  try {
    const { data: authData, error: authError } = await getAuthUser();
    const user = authData?.user;

    if (authError || !user) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data: currentTraining, error: currentTrainingError } =
      await getTrainingById({
        id,
        userId: user.id,
      });

    if (currentTrainingError) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    if (!currentTraining) {
      return err({ reason: "NOT_FOUND" });
    }

    const { error: updateTrainingError } = await updateTrainingById({
      id,
      userId: user.id,
      date: parsed.data.date,
      name: parsed.data.name,
      description: parsed.data.description,
    });

    if (updateTrainingError) {
      return err({ reason: "TRAINING_UPDATE_ERROR" });
    }

    if (parsed.data.exercises) {
      const { error: deleteExercisesError } =
        await deleteExercisesByTrainingId(id);

      if (deleteExercisesError) {
        return err({ reason: "EXERCISE_DELETE_ERROR" });
      }

      for (const exercise of parsed.data.exercises) {
        const { data: createdExercise, error: createExerciseError } =
          await createExercise({
            trainingId: id,
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
    }

    const { data: updatedTraining, error: updatedTrainingError } =
      await getTrainingById({
        id,
        userId: user.id,
      });

    if (updatedTrainingError || !updatedTraining) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    return ok({
      training: mapTrainingResponse(updatedTraining as TrainingRow),
    });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
