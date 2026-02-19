import { getAuthUser, getTrainingById } from "@/data";
import { err, ok } from "@/services/utils";
import type { TrainingRow } from "./types";
import { mapTrainingResponse } from "./utils";

export async function getTrainingService(id: string) {
  if (!id) {
    return err({ reason: "VALIDATION_ERROR" });
  }

  try {
    const { data: authData, error: authError } = await getAuthUser();
    const user = authData?.user;

    if (authError || !user) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data, error } = await getTrainingById({ id, userId: user.id });

    if (error) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    if (!data) {
      return err({ reason: "NOT_FOUND" });
    }

    return ok({ training: mapTrainingResponse(data as TrainingRow) });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
