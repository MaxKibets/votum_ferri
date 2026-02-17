import { AUTH_FIELD_NAME } from "@/constants";
import { signInWithPassword } from "@/data/auth";
import { LOGIN_SCHEMA } from "@/schemas";
import { err, ok } from "@/services/utils";

export async function loginUserService(formData: FormData) {
  const { success, error, data } = LOGIN_SCHEMA.safeParse({
    [AUTH_FIELD_NAME.EMAIL]: formData.get(AUTH_FIELD_NAME.EMAIL),
    [AUTH_FIELD_NAME.PASSWORD]: formData.get(AUTH_FIELD_NAME.PASSWORD),
  });

  if (!success) {
    return err({ reason: "VALIDATION_ERROR", details: error.issues[0] });
  }

  try {
    const { data: authData, error: authError } = await signInWithPassword({
      [AUTH_FIELD_NAME.EMAIL]: data[AUTH_FIELD_NAME.EMAIL],
      [AUTH_FIELD_NAME.PASSWORD]: data[AUTH_FIELD_NAME.PASSWORD],
    });

    if (authError) {
      return err({ reason: "AUTH_ERROR" });
    }

    if (!authData?.user) {
      return err({ reason: "USER_NOT_FOUND" });
    }

    return ok({ user: authData.user });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
