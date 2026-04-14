/**
 * Heurische Extraktion aus  Roh-Website-Text (ohne LLM).
 * Kein Ersatz für echte Recherce- MVP-Qualität für Demo & Offline.
 */

import type { DeepResearchSnapshot } from "./deepResearch";

function htmlToPlainText(html: string): string {
    let t = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ");
    t = t.replace(/<[^>]+>/g, " ");
    t = t
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
        String.fromCharCode(parseInt(h, 16))
      );
    return t.replace(/\s+/g, " ").trim();
}

function pickTitle(html: string): string {
    const m = html.match(/<title>[^>]*>([^<]*)<\/title>/i);
    return m ? m[1]?.trim() ?? "";
}

function pickMetaDescription(html: string):string {
    const m = html.match
      /<meta[^>]*name=[" ']description[" '][^>]*content=[" ']([^" ']+)[" ']/i;
    );
    if (m?.[1]) return m[1].trim();
    const m2 = html.match(
        /<meta[^>]+content=[" ']([^" ']*)[" '][^>]+name=[" ']description[" ']/i
    );
    return m2?.[1]?.trim() ?? "";
}

function pickFirstH1(html:string): string {
    const m = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    return m ? m[1] ? htmlToPlainText(m[1]).slice(0, 200) : "";
}

/** Sucht  nacht Anprechpartner / Rolle im Fließtext. */
function pickContactPerson(text: string): string {
    const patterns = [
        /(?:Geschäftsführer|Geschäftsführerin|Inhaber|Inhaberin|CEO|GF|Geschäftsführung)\s*[:\s]+\s*([A-ZÄÖÜ
        /([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)\s*[,(]\s*(?:Geschäftsführer|Inhaber|CEO)/i,
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m?.[1]) return m[1].trim();
    }
    return "",
}

/** Grobe Branchen-Schlagworte → typische Probleme (Platzhalter-Logik). */
function guessIndustryProblems(text: string): string {
    const t = text.toLowerCase();
    if (/shopify|e-?commerce|onlineshop|shop\b/i.test(t))
      return "Häufige Themen im E-Commerce: Conversion, Warenkorb-Abbruch, Performance und klare Produktkommunikation.";
    if (/agentur|webdesign|seo|marketing/i.test(t))
      return "Typisch für Dienstleister: Kapazität, messbare Ergebnisse und Abgrenzung vom Wettbewerb.";
    if (/handwerk|schreiner|elektro|installateur/i.test(t))
      return "Im Handwerk: Fachkräftemangel, Terminplanung und sichtbare Online-Präsenz gegenüber Großanbietern.";
    if (/saas|software|app\b/i.test(t))
      return "Bei Software: Onboarding, Retention und der Nachweis des ROI für Entscheider.";
    return "Branchenübergreifend: Zeitdruck bei Entscheidern, Digitalisierung und klare Priorisierung – im Gespräch vertiefen.";
  }

export function extractHeuristicFromHtml(
    html: string,
    pageUrl: string,
): Omit<DeepResearchSnapshot, "fetchedAt" | "source"> {
    const title = pickTitle(html);
    const meta = pickMetaDescription(html);
    const h1 = pickFirstH1(html);
    const plain = htmlToPlainText(html).slice(0, 25_000);
    const contact = extractContact(plain) || extractContact(title);

    const mainBits = [h1, title, meta].filter(Boolean);
    const mainOffer = 
      mainBits[0] ||
      plain.slice(0, 280) ||
      "Inhalt der Seite konnte nicht eindeutig zussammengefasst werden.";

    const newsHook = 
      extractNewsHook(plain, meta) ||
      meta ||
      "Kein aktueller News-Haken im sichtbaren Text - persöhnlichen Bezug im Gespräch klären.";

    return {
        url: pageUrl,
        mainOffer: mainOffer.slice(0, 500),
        newsHook: newsHook.slice(0, 500),
        industryProblems: guessIndustryProblems(plain + " " + meta),
        contactPerson: contact || "Kein Ansprechpartner automatisch erkannt - im Impressum nachsehen.",
    };
}