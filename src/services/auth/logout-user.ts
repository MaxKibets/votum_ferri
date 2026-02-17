import { signOut } from "@/data/auth";
import { err, ok } from "@/services/utils";

export async function logoutUserService() {
  try {
    const { error } = await signOut();

    if (error) {
      return err({ reason: "LOGOUT_ERROR" });
    }

    return ok({ success: true });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
