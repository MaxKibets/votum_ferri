import { getProfileById } from "@/data";
import { getAuthUser } from "@/data/auth";
import { err, ok } from "@/services/utils";

export async function getCurrentUserService() {
  try {
    const { data: authData, error: authError } = await getAuthUser();
    const authUser = authData?.user;

    if (authError) {
      return err({ reason: "AUTH_ERROR" });
    }

    if (!authUser) {
      return err({ reason: "UNAUTHORIZED" });
    }

    const { data: profileData, error: profileError } = await getProfileById(
      authUser.id,
    );

    if (profileError || !profileData) {
      return err({ reason: "PROFILE_ERROR" });
    }

    return ok({
      user: {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name || undefined,
      },
    });
  } catch {
    return err({ reason: "UNKNOWN_ERROR" });
  }
}
