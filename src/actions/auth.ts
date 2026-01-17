"use server";

import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PublicUser } from "@/types/user";
import { LOGIN_SCHEMA, REGISTER_SCHEMA } from "@/constants/authValidationSchemas";
import { ROUTE } from "@/constants/routes";

// Response types
type AuthResponse<T> = {
  data: T | null;
  error: { code: string; message: string, field?: string } | null;
};

/**
 * Register a new user
 */
export async function registerUser(
  prevState: AuthResponse<{ success: boolean }> | null,
  formData: FormData,
): Promise<AuthResponse<{ success: boolean }>> {
  const supabase = await createClient();

  const { success, error, data } = REGISTER_SCHEMA.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name") || undefined,
  });

  if (!success) {
    return {
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: error.issues[0]?.message || "Validation failed",
      },
    };
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
    return {
      data: null,
      error: {
        code: authError.name || "REGISTRATION_ERROR",
        message: authError.message,
      },
    };
  }

  // Check if user already exists (Supabase returns user object but with empty identities or no session)
  if (authData.user && (!authData.user.identities || authData.user.identities.length === 0)) {
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
    return {
      data: null,
      error: {
        code: "REGISTRATION_ERROR",
        message: "Failed to create user",
      },
    };
  }

  // TODO: Add redirect after successful registration
  redirect(ROUTE.DASHBOARD, RedirectType.replace);
}

/**
 * Login user
 */
export async function loginUser(
  prevState: AuthResponse<{ success: boolean }> | null,
  formData: FormData,
): Promise<AuthResponse<{ success: boolean }>> {
  const supabase = await createClient();

  const { success, error, data } = LOGIN_SCHEMA.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!success) {
    return {
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: error.issues[0]?.message || "Validation failed",
      },
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return {
      data: null,
      error: {
        code: authError.name || "LOGIN_ERROR",
        message: authError.message,
      },
    };
  }

  if (!authData.user) {
    return {
      data: null,
      error: {
        code: "LOGIN_ERROR",
        message: "Failed to authenticate user",
      },
    };
  }

  redirect(ROUTE.DASHBOARD, RedirectType.replace);
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<AuthResponse<{ success: boolean }>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        data: null,
        error: {
          code: error.name || "LOGOUT_ERROR",
          message: error.message,
        },
      };
    }

    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthResponse<{ user: PublicUser }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        },
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      return {
        data: null,
        error: {
          code: "PROFILE_ERROR",
          message: "Failed to retrieve user profile",
        },
      };
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
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
