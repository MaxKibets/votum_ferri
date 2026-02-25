import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/shared/api/supabase";
import { ROUTES } from "@/shared/config/routes";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? ROUTES.protected;

  const supabase = await getSupabaseServerClient();

  // PKCE Authorization Code flow (default for email confirmation)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      redirect(`${ROUTES.auth.error}?error_code=email_confirmation_failed`);
    }
    redirect(next);
  }

  // OTP / token_hash flow (magic link, older Supabase versions)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) {
      redirect(`${ROUTES.auth.error}?error_code=email_confirmation_failed`);
    }
    redirect(next);
  }

  redirect(`${ROUTES.auth.error}?error_code=email_confirmation_failed`);
}
