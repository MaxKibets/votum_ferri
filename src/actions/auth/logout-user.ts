"use server";

import { RedirectType, redirect } from "next/navigation";
import { err } from "@/actions/utils";
import { ROUTE } from "@/constants";
import { logoutUserService } from "@/services";

/**
 * Logout user
 */
export async function logoutUser() {
  const [error] = await logoutUserService();

  if (!error) {
    redirect(ROUTE.HOME, RedirectType.replace);
  }

  const { reason } = error;

  switch (reason) {
    case "LOGOUT_ERROR":
      return err("Failed to logout. Please try again later");
    case "UNKNOWN_ERROR":
      return err("An unknown error occurred. Please try again later");
    default:
      throw new Error(`Unhandled error: ${reason satisfies never}`);
  }
}
