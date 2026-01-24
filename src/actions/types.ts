import type { ACTION_ERROR_CODES } from "./constants";

export type AuthResponse<T> = {
  data: T | null;
  error: { code: string; message: string; field?: string } | null;
};

export type ActionErrorCode =
  (typeof ACTION_ERROR_CODES)[keyof typeof ACTION_ERROR_CODES];
