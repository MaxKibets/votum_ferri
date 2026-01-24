import { ACTION_ERROR_MESSAGES } from "./constants";
import type { ActionErrorCode, AuthResponse } from "./types";

function getZodFieldPath(issue?: { path?: unknown[] }): string | undefined {
  const first = issue?.path?.[0];
  return typeof first === "string" ? first : undefined;
}

type ActionErrorOptions = {
  error?: { name?: string; message: string };
  issue?: { message?: string; path?: unknown[] };
  message?: string;
  field?: string;
};

export function actionErrorResponse<T>(
  code: ActionErrorCode,
  options: ActionErrorOptions = {},
): AuthResponse<T> {
  const resolvedCode = options.error?.name || code;
  const resolvedMessage =
    options.message ||
    options.error?.message ||
    options.issue?.message ||
    ACTION_ERROR_MESSAGES[code];
  const resolvedField = options.field ?? getZodFieldPath(options.issue);

  return {
    data: null,
    error: {
      code: resolvedCode,
      message: resolvedMessage,
      field: resolvedField,
    },
  };
}
