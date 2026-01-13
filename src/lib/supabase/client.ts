import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser/client-side usage.
 * This client automatically handles cookies and session management.
 *
 * @returns Supabase client instance for browser
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
