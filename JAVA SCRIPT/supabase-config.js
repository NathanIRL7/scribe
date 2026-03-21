// Hier kommen deine Supabase-Daten rein
// Von supabase.com → Projekt → Settings → API
const SUPABASE_URL = "https://zcwqjxicmfiarhgxigzn.supabase.co";
const SUPABASE_KEY = "sb_publishable_6OUNreJ_MhTZ3qjkIkjkng_LVoUwuo0";

try {
  const supabaseLib = (typeof supabase !== "undefined" ? supabase : null) || (typeof window !== "undefined" ? window.supabase : null);
  if(!supabaseLib || !supabaseLib.createClient) {
    throw new Error("Supabase-Bibliothek nicht geladen oder nicht korrekt initialisiert");
  }
  const { createClient } = supabaseLib;
  window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  if (!window.supabase || !window.supabase.auth) {
    throw new Error("Supabase-Client nicht korrekt initialisiert");
  }
} catch (err) {
  console.error("Supabase-Konfiguration fehlgeschlagen:", err.message);
  window.supabase = null;
}
