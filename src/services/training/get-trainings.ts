import z from "zod";
import { getAuthUser, getTrainings } from "@/data";
import { err, ok } from "@/services/utils";
import type { GetTrainingsParams } from "@/types";
import type { TrainingRow } from "./types";
import { mapTrainingResponse } from "./utils";

const GET_TRAININGS_PARAMS_SCHEMA = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().min(0).optional(),
});

export async function getTrainingsService(params?: GetTrainingsParams) {
  const parsed = GET_TRAININGS_PARAMS_SCHEMA.safeParse(params ?? {});

  if (!parsed.success) {
    return err({ reason: "VALIDATION_ERROR", details: parsed.error.issues[0] });
  }

  try {
    const { data: authData, error: authError } = await getAuthUser();
    const user = authData?.user;

    if (authError || !user) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data, error, count } = await getTrainings({
      userId: user.id,
      params: parsed.data,
    });

    if (error) {
      return err({ reason: "TRAINING_FETCH_ERROR" });
    }

    const trainings =
      (data as TrainingRow[] | null)?.map(mapTrainingResponse) ?? [];

    return ok({
      trainings,
      total: typeof count === "number" ? count : undefined,
    });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
