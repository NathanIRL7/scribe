/**
 * Heuristische Extraktion aus Roh-Website-Text (ohne LLM).
 * Kein Ersatz fuer echte Recherche - MVP-Qualitaet fuer Demo & Offline.
 */

import type { DeepResearchSnapshot } from "./deepResearch";

function htmlToPlainText(html: string): string {
  let t = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ");
  t = t.replace(/<[^>]+>/g, " ");
  t = t
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) =>
      String.fromCharCode(parseInt(h, 16))
    );
  return t.replace(/\s+/g, " ").trim();
}

function pickTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1]?.trim() ?? "";
}

function pickMetaDescription(html: string): string {
  const m1 = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
  );
  if (m1?.[1]) return m1[1].trim();
  const m2 = html.match(
    /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i
  );
  return m2?.[1]?.trim() ?? "";
}

function pickFirstH1(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m?.[1] ? htmlToPlainText(m[1]).slice(0, 200) : "";
}

/** Sucht nach Ansprechpartner / Rolle im Fliesstext. */
function pickContactPerson(text: string): string {
  const patterns = [
    /(?:Geschaeftsfuehrer|Geschaeftsfuehrerin|Inhaber|Inhaberin|CEO|GF)\s*[:\s-]+\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*[,(]\s*(?:Geschaeftsfuehrer|Inhaber|CEO|Head|Leitung)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

function extractNewsHook(plain: string, meta: string): string {
  const trigger = plain.match(
    /(neu|update|launch|eroeffnet|eroeffnung|gewonnen|ausgezeichnet|kooperation|partnerschaft)[^.]{0,120}\./i
  );
  if (trigger?.[0]) return trigger[0].trim();
  return meta.trim();
}

/** Grobe Branchen-Schlagworte → typische Probleme (Platzhalter-Logik). */
function guessIndustryProblems(text: string): string {
  const t = text.toLowerCase();
  if (/shopify|e-?commerce|onlineshop|shop\b/.test(t)) {
    return "Hauefige Themen im E-Commerce: Conversion, Warenkorb-Abbruch, Performance und klare Produktkommunikation.";
  }
  if (/agentur|webdesign|seo|marketing/.test(t)) {
    return "Typisch fuer Dienstleister: Kapazitaet, messbare Ergebnisse und Abgrenzung vom Wettbewerb.";
  }
  if (/handwerk|schreiner|elektro|installateur/.test(t)) {
    return "Im Handwerk: Fachkraeftemangel, Terminplanung und sichtbare Online-Praesenz gegenueber Grossanbietern.";
  }
  if (/saas|software|app\b/.test(t)) {
    return "Bei Software: Onboarding, Retention und der Nachweis des ROI fuer Entscheider.";
  }
  return "Branchenuebergreifend: Zeitdruck bei Entscheidern, Digitalisierung und klare Priorisierung - im Gespraech vertiefen.";
}

export function extractHeuristicFromHtml(
  html: string,
  pageUrl: string
): Omit<DeepResearchSnapshot, "fetchedAt" | "source"> {
  const title = pickTitle(html);
  const meta = pickMetaDescription(html);
  const h1 = pickFirstH1(html);
  const plain = htmlToPlainText(html).slice(0, 25_000);
  const contact = pickContactPerson(plain) || pickContactPerson(title);

  const mainBits = [h1, title, meta].filter(Boolean);
  const mainOffer =
    mainBits[0] ||
    plain.slice(0, 280) ||
    "Inhalt der Seite konnte nicht eindeutig zusammengefasst werden.";

  const newsHook =
    extractNewsHook(plain, meta) ||
    "Kein aktueller News-Haken im sichtbaren Text - persoenlichen Bezug im Gespraech klaeren.";

  return {
    url: pageUrl,
    mainOffer: mainOffer.slice(0, 500),
    newsHook: newsHook.slice(0, 500),
    industryProblems: guessIndustryProblems(`${plain} ${meta}`),
    contactPerson: contact || "Kein Ansprechpartner automatisch erkannt - im Impressum nachsehen.",
  };
}