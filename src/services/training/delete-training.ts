import { deleteTrainingById, getAuthUser, getTrainingById } from "@/data";
import { err, ok } from "@/services/utils";

export async function deleteTrainingService(id: string) {
  if (!id) {
    return err({ reason: "VALIDATION_ERROR" });
  }

  try {
    const { data: authData, error: authError } = await getAuthUser();
    const user = authData?.user;

    if (authError || !user) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data: training, error: trainingError } = await getTrainingById({
      id,
      userId: user.id,
    });

    if (trainingError) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    if (!training) {
      return err({ reason: "NOT_FOUND" });
    }

    const { error: deleteTrainingError } = await deleteTrainingById({
      id,
      userId: user.id,
    });

    if (deleteTrainingError) {
      return err({ reason: "TRAINING_DELETE_ERROR" });
    }

    return ok({ success: true });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
