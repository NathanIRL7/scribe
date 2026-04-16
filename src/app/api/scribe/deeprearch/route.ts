import { NextResponse } from "next/server";
import type { DeepResearchSnapshot } from "@/lib/deepResearch";
import { extractHeuristicFromHtml } from "@/lib/deepResearchExtract";

export const maxDuration = 60;

function assertSafeHttpUrl(input: string): URL {
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    throw new Error("Ungueltige URL");
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Nur http(s) erlaubt");
  }

  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host === "0.0.0.0") {
    throw new Error("Diese Adresse ist nicht erlaubt");
  }

  const ipv4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 10) throw new Error("Private Adresse nicht erlaubt");
    if (a === 127) throw new Error("Private Adresse nicht erlaubt");
    if (a === 0) throw new Error("Private Adresse nicht erlaubt");
    if (a === 169 && b === 254) throw new Error("Private Adresse nicht erlaubt");
    if (a === 192 && b === 168) throw new Error("Private Adresse nicht erlaubt");
    if (a === 172 && b >= 16 && b <= 31) throw new Error("Private Adresse nicht erlaubt");
  }

  return u;
}

async function refineWithOpenAI(
  snippet: string,
  pageUrl: string
): Promise<
  Pick<
    DeepResearchSnapshot,
    "mainOffer" | "newsHook" | "industryProblems" | "contactPerson"
  > | null
> {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) return null;

  const system = `Du bist ein Research-Assistent fuer B2B-Akquise. Antworte NUR mit gueltigem JSON.
Felder:
- mainOffer: Hauptangebot (1-2 Saetze)
- newsHook: Auffaellige aktuelle Info oder "Kein konkreter News-Haken im Text."
- industryProblems: Typische Probleme der Branche (1-2 Saetze)
- contactPerson: Ansprechpartner oder "Nicht im Text gegeben."`;

  const user = `URL: ${pageUrl}\n\nWebsite-Auszug:\n${snippet.slice(0, 14_000)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_RESEARCH_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  try {
    const j = JSON.parse(raw) as Record<string, unknown>;
    const mainOffer = typeof j.mainOffer === "string" ? j.mainOffer : "";
    const newsHook = typeof j.newsHook === "string" ? j.newsHook : "";
    const industryProblems =
      typeof j.industryProblems === "string" ? j.industryProblems : "";
    const contactPerson = typeof j.contactPerson === "string" ? j.contactPerson : "";
    if (!mainOffer && !newsHook && !industryProblems && !contactPerson) return null;
    return { mainOffer, newsHook, industryProblems, contactPerson };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const inputUrl = typeof body.url === "string" ? body.url : "";
    const safe = assertSafeHttpUrl(inputUrl);

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 25_000);

    const pageRes = await fetch(safe.href, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "FreelancerOS-ScribeDeepResearch/1.0 (+https://example.invalid)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!pageRes.ok) {
      return NextResponse.json(
        { ok: false, error: `Seite nicht erreichbar (${pageRes.status})` },
        { status: 500 }
      );
    }

    const html = await pageRes.text();
    const base = extractHeuristicFromHtml(html, safe.href);
    const snippet = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 16_000);

    const llm = await refineWithOpenAI(snippet, safe.href);

    const snapshot: DeepResearchSnapshot = {
      url: safe.href,
      fetchedAt: new Date().toISOString(),
      mainOffer: llm?.mainOffer?.trim() || base.mainOffer,
      newsHook: llm?.newsHook?.trim() || base.newsHook,
      industryProblems: llm?.industryProblems?.trim() || base.industryProblems,
      contactPerson: llm?.contactPerson?.trim() || base.contactPerson,
      source: llm ? "llm" : "heuristic",
    };

    return NextResponse.json({ ok: true, research: snapshot });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Recherche fehlgeschlagen";
    const status = msg === "Ungueltige URL" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}