import { AUTH_FIELD_NAME } from "@/constants";
import { signUpWithEmail } from "@/data/auth";
import { REGISTER_SCHEMA } from "@/schemas";
import { err, ok } from "@/services/utils";

export async function registerUserService(formData: FormData) {
  const { success, error, data } = REGISTER_SCHEMA.safeParse({
    [AUTH_FIELD_NAME.EMAIL]: formData.get(AUTH_FIELD_NAME.EMAIL),
    [AUTH_FIELD_NAME.PASSWORD]: formData.get(AUTH_FIELD_NAME.PASSWORD),
    [AUTH_FIELD_NAME.NAME]: formData.get(AUTH_FIELD_NAME.NAME) || undefined,
  });

  if (!success) {
    return err({ reason: "VALIDATION_ERROR", details: error.issues[0] });
  }

  try {
    const { data: authData, error: authError } = await signUpWithEmail({
      [AUTH_FIELD_NAME.EMAIL]: data[AUTH_FIELD_NAME.EMAIL],
      [AUTH_FIELD_NAME.PASSWORD]: data[AUTH_FIELD_NAME.PASSWORD],
      [AUTH_FIELD_NAME.NAME]: data[AUTH_FIELD_NAME.NAME] || undefined,
    });

    if (authError) {
      return err({ reason: "SIGN_UP_ERROR" });
    }

    const user = authData?.user;

    if (user && (!user.identities || user.identities.length === 0)) {
      return err({ reason: "EMAIL_ALREADY_EXISTS" });
    }

    if (!user) {
      return err({ reason: "USER_NOT_CREATED" });
    }

    return ok({ user });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
