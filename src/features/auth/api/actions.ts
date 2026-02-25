"use server";

import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/shared/api/supabase";
import { ROUTES } from "@/shared/config/routes";
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
  type LoginFormData,
  loginSchema,
  type SignUpFormData,
  signUpSchema,
  type UpdatePasswordFormData,
  updatePasswordSchema,
} from "../lib/schemas";

interface ActionResult {
  error: string | null;
}

export async function signUpAction(
  data: SignUpFormData,
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await getSupabaseServerClient();

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}${ROUTES.auth.confirm}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function loginAction(data: LoginFormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function forgotPasswordAction(
  data: ForgotPasswordFormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await getSupabaseServerClient();

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "";

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${origin}${ROUTES.auth.updatePassword}` },
  );

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function updatePasswordAction(
  data: UpdatePasswordFormData,
): Promise<ActionResult> {
  const parsed = updatePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
