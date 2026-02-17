"use server";

import { RedirectType, redirect } from "next/navigation";
import { err } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { registerUserService } from "@/services";

/**
 * Register a new user
 */
export async function registerUser(_: unknown, formData: FormData) {
  const [error] = await registerUserService(formData);

  if (!error) {
    redirect(ROUTE.DASHBOARD, RedirectType.replace);
  }

  const { reason } = error;

  switch (reason) {
    case "VALIDATION_ERROR": {
      return err("Validation failed", error.details);
    }
    case "EMAIL_ALREADY_EXISTS":
      return err("User with this email already exists");
    case "SIGN_UP_ERROR":
      return err("Failed to sign up. Please try again later");
    case "USER_NOT_CREATED":
      return err("Failed to create user. Please try again later");
    case "UNKNOWN_ERROR":
      return err("An unknown error occurred. Please try again later");
    default:
      throw new Error(`Unhandled error: ${reason satisfies never}`);
  }
}
