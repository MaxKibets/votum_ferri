"use server";

import { cache } from "react";
import { getSupabaseServerClient } from "@/shared/api/supabase";
import type { AuthSession } from "../model/types";

export const getSession = cache(async (): Promise<AuthSession | null> => {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    accessToken: session.access_token,
  };
});
