/**
 * HER TURN - Supabase Client Configuration
 * 
 * Configures both SSR browser and server clients with graceful fallbacks
 * when environment variables are not yet configured or running in demo mode.
 */

import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Checks if Supabase credentials are validly configured in environment variables.
 * Prevents initialization errors if placeholders or empty strings are present.
 */
export function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false;
  }

  // Check for common placeholders
  const isPlaceholderUrl =
    SUPABASE_URL.includes('your-project') ||
    SUPABASE_URL.includes('placeholder') ||
    SUPABASE_URL === 'https://xyzcompany.supabase.co';

  const isPlaceholderKey =
    SUPABASE_ANON_KEY.includes('your-anon-key') ||
    SUPABASE_ANON_KEY.includes('placeholder') ||
    SUPABASE_ANON_KEY === 'ey...';

  return !isPlaceholderUrl && !isPlaceholderKey && SUPABASE_URL.startsWith('https://');
}

// Browser client singleton instance (memoized for client components)
let browserClientInstance: SupabaseClient | null = null;

/**
 * Creates or retrieves the singleton Supabase client for browser contexts.
 * Returns null gracefully if credentials are not configured.
 */
export function createBrowserSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    // If called on server, return null or instantiate without browser storage
    if (!isSupabaseConfigured()) return null;
    return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClientInstance) {
    browserClientInstance = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClientInstance;
}

/**
 * Alias for createBrowserSupabaseClient for convenience
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  return createBrowserSupabaseClient();
}

/**
 * Default browser client export.
 * Safe to import in client components; evaluates to null when unconfigured.
 */
export const supabase = typeof window !== 'undefined' && isSupabaseConfigured()
  ? createBrowserSupabaseClient()
  : null;

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * In Next.js 15, cookies() from next/headers is an async function.
 * Uses dynamic import so client bundles are not contaminated with server-only headers.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    // Dynamic import next/headers so client code that imports from this file doesn't crash
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be safely ignored if you have middleware refreshing user sessions.
          }
        },
      },
    });
  } catch (error) {
    console.warn('[Supabase Server Client] Could not initialize server cookies context:', error);
    return null;
  }
}
