"use server";

import { RedirectType, redirect } from "next/navigation";
import {
  LOGIN_SCHEMA,
  REGISTER_SCHEMA,
} from "@/constants/authValidationSchemas";
import { ROUTE } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";
import type { PublicUser } from "@/types/user";

// Response types
type AuthResponse<T> = {
  data: T | null;
  error: { code: string; message: string; field?: string } | null;
};

function getZodFieldPath(issue?: { path?: unknown[] }): string | undefined {
  const first = issue?.path?.[0];
  return typeof first === "string" ? first : undefined;
}

function validationErrorResponse<T>(issue?: {
  message?: string;
  path?: unknown[];
}): AuthResponse<T> {
  return {
    data: null,
    error: {
      code: "VALIDATION_ERROR",
      message: issue?.message || "Validation failed",
      field: getZodFieldPath(issue),
    },
  };
}

function authErrorResponse<T>(
  fallbackCode: string,
  error: { name?: string; message: string },
): AuthResponse<T> {
  return {
    data: null,
    error: {
      code: error.name || fallbackCode,
      message: error.message,
    },
  };
}

function genericErrorResponse<T>(
  code: string,
  message: string,
): AuthResponse<T> {
  return {
    data: null,
    error: { code, message },
  };
}

/**
 * Register a new user
 */
export async function registerUser(
  _prevState: AuthResponse<{ success: boolean }> | null,
  formData: FormData,
): Promise<AuthResponse<{ success: boolean }>> {
  const supabase = await createClient();

  const { success, error, data } = REGISTER_SCHEMA.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name") || undefined,
  });

  if (!success) {
    return validationErrorResponse(error.issues[0]);
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
    return authErrorResponse("REGISTRATION_ERROR", authError);
  }

  // Check if user already exists (Supabase returns user object but with empty identities or no session)
  if (
    authData.user &&
    (!authData.user.identities || authData.user.identities.length === 0)
  ) {
    return {
      data: null,
      error: {
        code: "EMAIL_ALREADY_EXISTS",
        message: "This email is already registered",
        field: "email",
      },
    };
  }

  if (!authData.user) {
    return genericErrorResponse("REGISTRATION_ERROR", "Failed to create user");
  }

  redirect(ROUTE.DASHBOARD, RedirectType.replace);
}

/**
 * Login user
 */
export async function loginUser(
  _prevState: AuthResponse<{ success: boolean }> | null,
  formData: FormData,
): Promise<AuthResponse<{ success: boolean }>> {
  const supabase = await createClient();

  const { success, error, data } = LOGIN_SCHEMA.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!success) {
    return validationErrorResponse(error.issues[0]);
  }

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (authError) {
    return authErrorResponse("LOGIN_ERROR", authError);
  }

  if (!authData.user) {
    return genericErrorResponse("LOGIN_ERROR", "Failed to authenticate user");
  }

  redirect(ROUTE.DASHBOARD, RedirectType.replace);
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<
  AuthResponse<{ success: boolean }>
> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return authErrorResponse("LOGOUT_ERROR", error);
  }

  redirect("/", RedirectType.replace);
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<
  AuthResponse<{ user: PublicUser }>
> {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return genericErrorResponse("UNAUTHORIZED", "User is not authenticated");
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      return genericErrorResponse(
        "PROFILE_ERROR",
        "Failed to retrieve user profile",
      );
    }

    const publicUser: PublicUser = {
      id: profile.id,
      email: profile.email,
      name: profile.name || undefined,
    };

    return {
      data: { user: publicUser },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: "UNKNOWN_ERROR",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
