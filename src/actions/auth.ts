"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PublicUser } from "@/types/user";
import { LOGIN_SCHEMA, REGISTER_SCHEMA } from "@/constants/authValidationSchemas";

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
  console.log("LOGIN USER");
  try {
    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | null;

    // Validate input
    const validated = REGISTER_SCHEMA.parse({
      email,
      password,
      name: name || undefined,
    });

    const supabase = await createClient();

    // Check if user already exists
    const existingUser = await supabase
      .from("profiles")
      .select("id")
      .single();

    if (existingUser) {
      return {
        data: null,
        error: {
          code: "USER_EXISTS",
          message: "User with this email already exists",
        },
      };
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          name: validated.name || null,
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

    if (!authData.user) {
      return {
        data: null,
        error: {
          code: "REGISTRATION_ERROR",
          message: "Failed to create user",
        },
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", authData.user.id)
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

    revalidatePath("/");
    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: error.issues[0]?.message || "Validation failed",
        },
      };
    }

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
 * Login user
 */
export async function loginUser(
  prevState: AuthResponse<{ success: boolean }> | null,
  formData: FormData,
): Promise<AuthResponse<{ success: boolean }>> {
  console.log("LOGIN USER");
  try {
    // Validate input
    const validated = LOGIN_SCHEMA.parse({
      email: formData.get("email"),
      password: formData.get("password")
    });

    const supabase = await createClient();

    // Sign in user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", authData.user.id)
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

    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: error.issues[0]?.message || "Validation failed",
        },
      };
    }

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
