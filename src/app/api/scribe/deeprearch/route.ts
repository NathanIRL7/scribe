import { NextResponse } from "next/server";
import type { DeepResearchSnapshot } from "@/lib/deepResearchExtract";

export const maxDuration = 60;

function assertSafeHttpUrl(input: string): string {
    let u: URL;
    try {
        u = new URL(input.trim());
    } catch {
        throw new Error("Ungültige URL");
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") {
        throw new Error("Nur http(s) erlaubt");
    }
    const host = u.hostname.toLowerCase();
    if (
        host === "localhost" || 
        host.endsWith(".localhost") ||
        host === "0.0.0.0"
    )   {
        throw new Error("Diese Adresse ist nicht erlaubt");
    }
    const ipv4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ipv4) {
        const a = Number(ipv4[1]);
        const b = Number(ipv4[2]);
        if (a === 10) throw new Error("Private Adresse nicht erlaubt");
        if (a === 127) throw new Error("Private Adressen nicht erlaubt");
        if (a === 0) throw new Error("Private Adressen nicht erlaubt");
        if (a === 169 && b === 254) throw new Error("Private Adressen nicht erlaubt");
        if (a === 192 && b === 168) throw new Error("Private Adressen nicht erlaubt");
        if (a === 172 && b >= 16 && b <== 31) throw new Error("Private Adressen nicht erlaubt");
    }
    return u;
}

async function refineWithOpenAi(
    snippet: string,
    pageUrl: string
):   Promise<Pick<
    DeepResearchSnapshot,
    "mainOffer" | "newsHook" | "industryProblems" | "contactPerson"
> | null> {
    const key = process.env.OPENAI_API_KEY;
    if (!key?.trim()) return null;

    const system = `Du bist ein Research-Assistent für B2B-Akquise. Antworte NUR mit gültigem JSON, keine Markdown-Fences.
Felder (alle auf Deutsch, kurz und sachlich):
- mainOffer: Was ist das Hauptangebot der Organisation? (1–2 Sätze)
- newsHook: Eine aktuelle oder auffällige Info aus dem Text für einen persönlichen Einstieg in eine Mail; wenn nichts erkennbar: kurz "Kein konkreter News-Haken im Text."
- industryProblems: Typische Probleme dieser Branche, auf die sich ein Freelancer beziehen kann (1–2 Sätze)
- contactPerson: Wer ist Ansprechpartner oder Entscheider, wenn im Text genannt; sonst "Nicht im Text gegeben.`;

    const user =`URL: ${pageUrl}\n\nWebsite-Auszug:\n${snippet.slice(0, 14_000)}`;

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
                { role: "system" , content: system },
                { role: "user", content: user },
            ],
            response_format: { type: "json_object" },
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("OpenAI deep-research", res.status, err);
        return null;
    }

    const data = (await res.json()) as {
        choices?: { message?: {cotent?: string} }[];
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    try {
        const j = JSON.parse(raw) as  Record<string, unknown>;
        const mainOffer = typeof j.mainOffer === "string" ? j.mainOffer : "";
        const newsHook = typeof j.newsHook === "string" ? j.newsHook : "";
        const industryProblems = 
          typeof j.industryProblems === "string" ? j.industryProblems : "";
        const contactPerson = 
          typeof j.contactPerson === "string" ? j.contactPerson : "";
        if (!mainOffer && !newsHook) return null;
        return { mainOffer, newsHook, industryProblems, contactPerson};
    }   catch {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as  { url?: string};
        const url = typeof body.url === "string" ? body.url : "";
        const safe = assertSafeHttpUrl(url);

        const crtl = new AbortController();
        const t = setTimeout(() => crtl.abort(), 25_000);
        const pageRes = await fetch(safe.href, {
            signal: crtl.signal,
            headers: {
                "User-Agent":
                  "FreelancerOS-ScribeDeepResearch/1.0 (+https://example.invalid)",
                Accept: "text/html,application/xhtml+xml",
            },
            redirect: "follow",
        });
        clearTimeout(t);
    }
}