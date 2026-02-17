import { createServerClient } from "@/lib/supabase";

export type SignInInput = {
  email: string;
  password: string;
};

export async function signInWithPassword({ email, password }: SignInInput) {
  const supabase = await createServerClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}
