/**
 * User-Profil in Supabase (scribe_profiles) – später: User_Context für den AI-Agent.
 * SQL: supabase/extend-ai-backend.sql
 */

import { supabase } from "@/lib/supabase";

export type ScribeProfile = {
  user_id: string;
  skills: unknown;
  portfolio_urls: unknown;
  availability_hint: string | null;
  writing_style: string | null;
  reference_project: string | null;
  updated_at: string;
};

export type ScribeProfileInput = {
  skills?: unknown;
  portfolio_urls?: unknown;
  availability_hint?: string | null;
  writing_style?: string | null;
  reference_project?: string | null;
};

export async function fetchProfile(): Promise<{ data: ScribeProfile | null; error: Error | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Nicht angemeldet.") };

    const { data, error } = await supabase
      .from("scribe_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ScribeProfile | null, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error("Profil konnte nicht geladen werden."),
    };
  }
}

/** Legt bei Bedarf eine Zeile an und aktualisiert sie (Upsert). */
export async function upsertProfile(
  input: ScribeProfileInput
): Promise<{ data: ScribeProfile | null; error: Error | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Nicht angemeldet.") };

    const row = {
      user_id: user.id,
      ...input,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("scribe_profiles")
      .upsert(row, { onConflict: "user_id" })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ScribeProfile, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error("Profil konnte nicht gespeichert werden."),
    };
  }
}
