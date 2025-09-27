
import { createClient } from '@supabase/supabase-js';

// Attempt to load Supabase credentials from Vite environment variables for production.
// Fallback to hardcoded values for local/non-Vite development environments.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://kyzmcjecfucuvopzyayx.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5em1jamVjZnVjdXZvcHp5YXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzcwOTYsImV4cCI6MjA3NDU1MzA5Nn0.VG3hpUkjZb2ZMP4ySgWqNG2DUkQYWHGTFpKks_nzWy4';


if (!supabaseUrl || !supabaseAnonKey) {
  // This error will be thrown during the build process or at runtime if the environment variables are missing.
  // It's a safeguard to prevent deploying a non-functional app.
  throw new Error('Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
