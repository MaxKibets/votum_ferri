import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/shared/config/env";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
  return client;
}
