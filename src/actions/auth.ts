"use server";

import { RedirectType, redirect } from "next/navigation";
import { AUTH_FIELD_NAME } from "@/constants/authFieldNames";
import {
  LOGIN_SCHEMA,
  REGISTER_SCHEMA,
} from "@/constants/authValidationSchemas";
import { ROUTE } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";
import type { PublicUser } from "@/types/user";
import { ACTION_ERROR_CODES } from "./constants";
import type { AuthResponse } from "./types";
import { actionErrorResponse, withActionError } from "./utils";

/**
 * Register a new user
 */
export async function registerUser(
  _prevState: AuthResponse<null> | null,
  formData: FormData,
): Promise<AuthResponse<null>> {
  return withActionError(async () => {
    const supabase = await createClient();

    const { success, error, data } = REGISTER_SCHEMA.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name") || undefined,
    });

    if (!success) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        issue: error.issues[0],
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name || null,
        },
      },
    });

    if (authError) {
      return actionErrorResponse(ACTION_ERROR_CODES.REGISTRATION, {
        error: authError,
      });
    }

    // Check if user already exists (Supabase returns user object but with empty identities or no session)
    if (
      authData.user &&
      (!authData.user.identities || authData.user.identities.length === 0)
    ) {
      return actionErrorResponse(ACTION_ERROR_CODES.EMAIL_ALREADY_EXISTS, {
        field: AUTH_FIELD_NAME.EMAIL,
      });
    }

    if (!authData.user) {
      return actionErrorResponse(ACTION_ERROR_CODES.REGISTRATION);
    }

    redirect(ROUTE.DASHBOARD, RedirectType.replace);
  });
}

/**
 * Login user
 */
export async function loginUser(
  _prevState: AuthResponse<null> | null,
  formData: FormData,
): Promise<AuthResponse<null>> {
  return withActionError(async () => {
    const supabase = await createClient();

    const { success, error, data } = LOGIN_SCHEMA.safeParse({
      email: formData.get(AUTH_FIELD_NAME.EMAIL),
      password: formData.get(AUTH_FIELD_NAME.PASSWORD),
    });

    if (!success) {
      return actionErrorResponse(ACTION_ERROR_CODES.VALIDATION, {
        issue: error.issues[0],
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data[AUTH_FIELD_NAME.EMAIL],
        password: data[AUTH_FIELD_NAME.PASSWORD],
      });

    if (authError) {
      return actionErrorResponse(ACTION_ERROR_CODES.LOGIN, {
        error: authError,
      });
    }

    if (!authData.user) {
      return actionErrorResponse(ACTION_ERROR_CODES.LOGIN);
    }

    redirect(ROUTE.DASHBOARD, RedirectType.replace);
  });
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<AuthResponse<null>> {
  return withActionError(async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return actionErrorResponse(ACTION_ERROR_CODES.LOGOUT, { error });
    }

    redirect("/", RedirectType.replace);
  });
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthResponse<{ user: PublicUser }>> {
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
