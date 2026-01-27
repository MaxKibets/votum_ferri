import { ACTION_ERROR_CODES, ACTION_ERROR_MESSAGES } from "./constants";
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

function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

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

export function actionUnknownErrorResponse<T>(error: unknown): AuthResponse<T> {
  return actionErrorResponse(ACTION_ERROR_CODES.UNKNOWN, {
    message: error instanceof Error ? error.message : undefined,
  });
}

export async function withActionError<T>(
  action: () => Promise<AuthResponse<T>>,
): Promise<AuthResponse<T>> {
  try {
    return await action();
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return actionUnknownErrorResponse(error);
  }
}
