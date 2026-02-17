"use server";

import { redirect } from "next/navigation";
import { ROUTE } from "@/constants";
import { getCurrentUserService } from "@/services";

/**
 * Get current user
 */
export async function getCurrentUser() {
  const [error, data] = await getCurrentUserService();

  if (!error) {
    return data.user;
  }

  const { reason } = error;

  // TODO: handle redirect to correct places based on the error
  switch (reason) {
    case "AUTH_ERROR":
      return redirect(ROUTE.LOGIN);
    case "UNAUTHORIZED":
      return redirect(ROUTE.LOGIN);
    case "PROFILE_ERROR":
      return redirect(ROUTE.LOGIN);
    case "UNKNOWN_ERROR":
      return redirect(ROUTE.LOGIN);
    default:
      throw new Error(`Unhandled error: ${reason satisfies never}`);
  }
}
