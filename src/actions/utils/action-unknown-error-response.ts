import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import { actionErrorResponse } from "./action-error-response";

export function actionUnknownErrorResponse<T>(
  error: unknown,
): ActionResponse<T> {
  return actionErrorResponse(ACTION_ERROR_CODES.UNKNOWN, {
    message: error instanceof Error ? error.message : undefined,
  });
}
