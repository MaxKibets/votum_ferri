"use server";

import { RedirectType, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import { actionErrorResponse, withActionError } from "../utils";

export async function logoutUser(): Promise<ActionResponse<null>> {
  return withActionError(async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return actionErrorResponse(ACTION_ERROR_CODES.LOGOUT, { error });
    }

    redirect("/", RedirectType.replace);
  });
}
