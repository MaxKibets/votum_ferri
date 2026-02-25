"use server";

import { cache } from "react";
import { getSupabaseServerClient } from "@/shared/api/supabase";
import type { UserProfile } from "../model/types";

export const getUserProfile = cache(
  async (userId: string): Promise<UserProfile | null> => {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return null;
    }

    return data as UserProfile;
  },
);
