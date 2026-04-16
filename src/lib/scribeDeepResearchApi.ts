import type { DeepResearchSnapshot } from "./deepResearch";

export type DeepResearchResult =
  | { ok: true; research: DeepResearchSnapshot }
  | { ok: false; error: string };

export async function fetchDeepResearch(url: string): Promise<DeepResearchResult> {
  const trimmed = url.trim();

  const res = await fetch("/api/scribe/deep-research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: trimmed }),
  });

  const data = (await res.json()) as
    | { ok: true; research: DeepResearchSnapshot }
    | { ok: false; error?: string };

  if (!res.ok || !data.ok) {
    const err =
      !data.ok && typeof data.error === "string"
        ? data.error
        : `Anfrage fehlgeschlagen (${res.status})`;
    return { ok: false, error: err };
  }

  return { ok: true, research: data.research };
}