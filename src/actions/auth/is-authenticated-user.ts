"use server";

import { getCurrentUserService } from "@/services";

/**
 * Get current user
 */
export async function isAuthenticatedUser() {
  const [error] = await getCurrentUserService();

  if (!error) {
    return true;
  }

  return false
}
