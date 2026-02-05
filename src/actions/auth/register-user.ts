"use server";

import { RedirectType, redirect } from "next/navigation";
import { AUTH_FIELD_NAME } from "@/constants/authFieldNames";
import { REGISTER_SCHEMA } from "@/constants/authValidationSchemas";
import { ROUTE } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import { actionErrorResponse, withActionError } from "../utils";

export async function registerUser(
  _prevState: ActionResponse<null> | null,
  formData: FormData,
): Promise<ActionResponse<null>> {
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
