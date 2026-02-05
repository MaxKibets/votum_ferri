import type { ActionResponse } from "../types";
import { actionUnknownErrorResponse } from "./action-unknown-error-response";

function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

export async function withActionError<T>(
  action: () => Promise<ActionResponse<T>>,
): Promise<ActionResponse<T>> {
  try {
    return await action();
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return actionUnknownErrorResponse(error);
  }
}
