/**
 * Zentrale Backend-Schicht für Scribe (Supabase).
 *
 * Ablauf für den späteren AI-Agent (Konzept):
 * 1. research  → source_content / Rohkontext (Job-Typ `research`)
 * 2. extract   → lead_pain_point (Job-Typ `extract`, Mini-Modell)
 * 3. generate  → generated_message auf dem Lead (Job-Typ `generate`, Master-Prompt)
 *
 * Module:
 * - `scribeLeadsApi` – CRM / Leads
 * - `scribeProfileApi` – User_Context (Skills, Portfolio, Schreibstil, Referenz)
 * - `scribeAgentJobsApi` – Audit-Log & Status pro Schritt
 *
 * API-Route mit OPENAI_API_KEY kommt später; Jobs sind schon speicherbar.
 */

export * from "./scribeLeadsApi";
export * from "./scribeProfileApi";
export * from "./scribeAgentJobsApi";
