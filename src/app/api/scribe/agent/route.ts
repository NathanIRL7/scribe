import { NextResponse } from "next/server";

/**
 * Platzhalter für die spätere „Scribe Engine“ (Research / Extract / Generate).
 * Body: { leadId: string, step: "research" | "extract" | "generate" }
 *
 * Als Nächstes: Session prüfen, Job anlegen, KI aufrufen, Lead + Job aktualisieren.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "Agent-Endpoint ist vorbereitet. Tabelle scribe_agent_jobs + extend-ai-backend.sql ausführen, dann KI anbinden.",
    },
    { status: 501 }
  );
}
