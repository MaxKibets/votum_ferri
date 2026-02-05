"use server";

import { RedirectType, redirect } from "next/navigation";
import { AUTH_FIELD_NAME } from "@/constants/authFieldNames";
import { LOGIN_SCHEMA } from "@/constants/authValidationSchemas";
import { ROUTE } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { ACTION_ERROR_CODES } from "../constants";
import type { ActionResponse } from "../types";
import { actionErrorResponse, withActionError } from "../utils";

export async function loginUser(
  _prevState: ActionResponse<null> | null,
  formData: FormData,
): Promise<ActionResponse<null>> {
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
