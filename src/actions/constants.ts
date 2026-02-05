import type { ActionErrorCode } from "./types";

export const ACTION_ERROR_CODES = {
  VALIDATION: "VALIDATION_ERROR",
  REGISTRATION: "REGISTRATION_ERROR",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  LOGIN: "LOGIN_ERROR",
  LOGOUT: "LOGOUT_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  PROFILE: "PROFILE_ERROR",
  TRAINING: "TRAINING_ERROR",
  EXERCISE: "EXERCISE_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNKNOWN: "UNKNOWN_ERROR",
} as const;

export const ACTION_ERROR_MESSAGES = {
  [ACTION_ERROR_CODES.VALIDATION]: "Validation failed",
  [ACTION_ERROR_CODES.REGISTRATION]: "Failed to create user",
  [ACTION_ERROR_CODES.EMAIL_ALREADY_EXISTS]: "This email is already registered",
  [ACTION_ERROR_CODES.LOGIN]: "Failed to authenticate user",
  [ACTION_ERROR_CODES.LOGOUT]: "Failed to logout user",
  [ACTION_ERROR_CODES.UNAUTHORIZED]: "User is not authenticated",
  [ACTION_ERROR_CODES.PROFILE]: "Failed to retrieve user profile",
  [ACTION_ERROR_CODES.TRAINING]: "Training operation failed",
  [ACTION_ERROR_CODES.EXERCISE]: "Exercise operation failed",
  [ACTION_ERROR_CODES.NOT_FOUND]: "Resource not found",
  [ACTION_ERROR_CODES.UNKNOWN]: "An unknown error occurred",
} as Record<ActionErrorCode, string>;
