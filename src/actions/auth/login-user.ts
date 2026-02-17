"use server";

import { RedirectType, redirect } from "next/navigation";
import { err } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { loginUserService } from "@/services";

/**
 * Login user
 */
export async function loginUser(_: unknown, formData: FormData) {
  const [error] = await loginUserService(formData);

  if (!error) {
    redirect(ROUTE.DASHBOARD, RedirectType.replace);
  }

  const { reason } = error;

  switch (reason) {
    case "VALIDATION_ERROR": {
      return err("Validation failed", error.details);
    }
    case "AUTH_ERROR":
      return err("Authentication failed. Please try again later");
    case "USER_NOT_FOUND":
      return err(
        "Failed to authenticate user. Please check your credentials and try again",
      );
    case "UNKNOWN_ERROR":
      return err("An unknown error occurred. Please try again later");
    default:
      throw new Error(`Unhandled error: ${reason satisfies never}`);
  }
}
