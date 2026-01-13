import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side usage (Server Components, Server Actions, Route Handlers).
 * This client uses Next.js cookies() API for session management.
 *
 * Note: In Server Components (read-only), cookie mutations will log warnings.
 * For session refresh, use middleware.
 *
 * @returns Supabase client instance for server
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // In Server Components, cookie mutations are read-only
            // This is expected behavior and can be ignored
          }
        },
      },
    }
  );
}
