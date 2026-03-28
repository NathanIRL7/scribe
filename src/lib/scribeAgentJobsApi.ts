/**
 * Agent-Jobs (scribe_agent_jobs) – ein Eintrag pro Schritt: research | extract | generate.
 * Später: echte KI schreibt output_payload; UI liest Historie pro Lead.
 * SQL: supabase/extend-ai-backend.sql
 */

import { supabase } from "@/lib/supabase";

export type AgentJobType = "research" | "extract" | "generate";
export type AgentJobStatus = "queued" | "running" | "completed" | "failed";

export type ScribeAgentJob = {
  id: string;
  user_id: string;
  lead_id: string;
  job_type: AgentJobType;
  status: AgentJobStatus;
  input_payload: Record<string, unknown>;
  output_payload: Record<string, unknown>;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export async function listJobsForLead(
  leadId: string
): Promise<{ data: ScribeAgentJob[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("scribe_agent_jobs")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: new Error(error.message) };
    return { data: (data ?? []) as ScribeAgentJob[], error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error("Jobs konnten nicht geladen werden."),
    };
  }
}

export async function createAgentJob(input: {
  leadId: string;
  jobType: AgentJobType;
  inputPayload?: Record<string, unknown>;
}): Promise<{ data: ScribeAgentJob | null; error: Error | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Nicht angemeldet.") };

    const { data, error } = await supabase
      .from("scribe_agent_jobs")
      .insert({
        user_id: user.id,
        lead_id: input.leadId,
        job_type: input.jobType,
        status: "queued",
        input_payload: input.inputPayload ?? {},
        output_payload: {},
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ScribeAgentJob, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error("Job konnte nicht angelegt werden."),
    };
  }
}

export async function updateAgentJob(
  id: string,
  patch: {
    status?: AgentJobStatus;
    outputPayload?: Record<string, unknown>;
    errorMessage?: string | null;
  }
): Promise<{ error: Error | null }> {
  try {
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.outputPayload !== undefined) row.output_payload = patch.outputPayload;
    if (patch.errorMessage !== undefined) row.error_message = patch.errorMessage;

    const { error } = await supabase.from("scribe_agent_jobs").update(row).eq("id", id);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  } catch (e) {
    return {
      error: e instanceof Error ? e : new Error("Job konnte nicht aktualisiert werden."),
    };
  }
}
