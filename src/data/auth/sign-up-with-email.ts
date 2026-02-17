import { createServerClient } from "@/lib/supabase";

export type SignUpInput = {
  email: string;
  password: string;
  name?: string;
};

export async function signUpWithEmail({
  email,
  password,
  name,
}: SignUpInput) {
  const supabase = await createServerClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || null,
      },
    },
  });
}
