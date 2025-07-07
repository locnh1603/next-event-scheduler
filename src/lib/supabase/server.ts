import { env } from '@env';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async (serviceRoleKey?: string) => {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey || env.SUPABASE_PUBLIC_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        persistSession: false, // Important: Do not persist user sessions
      },
    }
  );
};

export const createAdminClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
      auth: {
        persistSession: false, // Important: Do not persist user sessions
      },
      global: {
        headers: {
          Authorization: '', // Ensure no Authorization header is sent by default.
        },
      },
    }
  );
};
