import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://knriykfmhjyaxxhpbgrc.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtucml5a2ZtaGp5YXh4aHBiZ3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NTM1MjksImV4cCI6MjEwNTAyOTUyOX0.TYwYPsQW7uyC6MUd6c6yPvpFz3bo0RxwrQZx9Sj_dP4";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
