import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Platzhalter? Dann Dummy-URL für Build (damit es nicht abstürzt)
const url =
  supabaseUrl && !supabaseUrl.includes("deine-url")
    ? supabaseUrl
    : "https://placeholder.supabase.co";
const key =
  supabaseAnonKey && !supabaseAnonKey.includes("dein-key")
    ? supabaseAnonKey
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabase = createClient(url, key);
