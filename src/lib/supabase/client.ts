import { env } from '@env';
import { createBrowserClient } from '@supabase/ssr';
export function createClient(serviceRoleKey?: string) {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey || env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
    {
      auth: {
        persistSession: false, // Important: Do not persist user sessions
      },
    }
  );
}
