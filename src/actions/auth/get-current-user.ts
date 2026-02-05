"use server";

import { createClient } from "@/lib/supabase/server";
import type { PublicUser } from "@/types/user";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import { actionErrorResponse, withActionError } from "../utils";

export async function getCurrentUser(): Promise<
  ActionResponse<{ user: PublicUser }>
> {
  return withActionError(async () => {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return actionErrorResponse(ACTION_ERROR_CODES.UNAUTHORIZED);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      return actionErrorResponse(ACTION_ERROR_CODES.PROFILE);
    }

    const publicUser = {
      id: profile.id,
      email: profile.email,
      name: profile.name || undefined,
    };

    return {
      data: { user: publicUser },
      error: null,
    };
  });
}
