import { createClient } from "@/lib/supabase/server";
import type { Training } from "@/types/training";
import type { TrainingRow } from "../types";
import { mapTraining } from "../utils";
import { TRAINING_SELECT_WITH_EXERCISES } from "./constants";

export async function fetchTrainingById(
  trainingId: string,
  userId: string,
): Promise<Training | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trainings")
    .select(TRAINING_SELECT_WITH_EXERCISES)
    .eq("id", trainingId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapTraining(data as TrainingRow);
}
