import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize variables to be exported.
// By handling errors here and exporting them, we prevent the entire module from crashing the app on import.
let supabase: SupabaseClient;
let supabaseInitializationError: Error | null = null;

try {
  // 1. Defensively check if the Vite-specific `import.meta.env` object exists.
  // FIX: Cast `import.meta` to `any` to fix an error where TypeScript cannot find the `env` property due to a missing `vite/client` type definition.
  if (typeof (import.meta as any).env === 'undefined') {
    throw new Error("FATAL: Vite environment variables are not loaded. Ensure your app is running via the Vite development server or has been built correctly.");
  }

  // FIX: Cast `import.meta` to `any` to fix an error where TypeScript cannot find the `env` property due to a missing `vite/client` type definition.
  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  // FIX: Cast `import.meta` to `any` to fix an error where TypeScript cannot find the `env` property due to a missing `vite/client` type definition.
  const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  // 2. Check for the existence of the required environment variables.
  if (!supabaseUrl) {
    throw new Error("FATAL: VITE_SUPABASE_URL is missing. Check your Vercel Environment Variables or your .env file.");
  }
  if (!supabaseKey) {
    throw new Error("FATAL: VITE_SUPABASE_ANON_KEY is missing. Check your Vercel Environment Variables or your .env file.");
  }

  // 3. If all checks pass, create the client.
  supabase = createClient(supabaseUrl, supabaseKey);

} catch (error) {
    // 4. If any of the above checks fail, capture the error to be displayed in the UI.
    if (error instanceof Error) {
        supabaseInitializationError = error;
    } else {
        supabaseInitializationError = new Error("An unknown error occurred during Supabase client initialization.");
    }
}

// @ts-ignore - Supabase is initialized in the try block. The error case is handled gracefully in App.tsx.
export { supabase, supabaseInitializationError };