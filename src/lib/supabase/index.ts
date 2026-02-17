/**
 * Supabase module interface.
 * All Supabase client exports go through this barrel file.
 */
export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
