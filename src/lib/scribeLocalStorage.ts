/**
 * Lokale Daten fuer Coscribe (Browser localStorage).
 * Spaeter durch Supabase ersetzbar - gleiche Konzepte: Entwuerfe, Kontakte, Profil.
 */

import type { DeepResearchSnapshot } from "./deepResearch";

export type { DeepResearchSnapshot } from "./deepResearch";

const KEYS = {
  drafts: "scribe_v1_drafts",
  contacts: "scribe_v1_contacts",
  profile: "scribe_v1_profile",
  style: "scribe_v1_schreibstil",
  campaigns: "scribe_v1_campaigns",
  styleLegacy: "scribe_v1_style",
} as const;

export type DraftType = "kalt-email" | "follow-up" | "antwort";

export type Draft = {
  id: string;
  type: DraftType;
  subject: string;
  body: string;
  toEmail?: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  note?: string;
  createdAt: string;
};

export type Profile = {
  displayName: string;
  company: string;
};

export type DraftDayActivity = {
  dateKey: string;
  labelShort: string;
  count: number;
};

export type CampaignStatus = "draft" | "waiting_reply" | "action_required" | "completed";
export type CampaignTone = "formell" | "locker" | "neutral";

export type CampaignPackage = {
  erstmailBetreff: string;
  erstmailBody: string;
  followUp1: string;
  followUp2: string;
  followUp3: string;
  checklist: string;
};

export type Campaign = {
  id: string;
  title: string;
  status: CampaignStatus;
  audience: string;
  offer: string;
  tone: CampaignTone;
  taboos: string;
  followUpCount: 1 | 2 | 3;
  package: CampaignPackage;
  research?: DeepResearchSnapshot;
  createdAt: string;
  updatedAt: string;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeDraft(raw: unknown): Draft | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : "";
  const type = o.type as DraftType;
  if (!id || !["kalt-email", "follow-up", "antwort"].includes(type)) return null;
  const updatedAt =
    typeof o.updatedAt === "string"
      ? o.updatedAt
      : typeof o.updateAt === "string"
        ? o.updateAt
        : new Date().toISOString();
  const createdAt = typeof o.createdAt === "string" ? o.createdAt : updatedAt;
  return {
    id,
    type,
    subject: typeof o.subject === "string" ? o.subject : "",
    body: typeof o.body === "string" ? o.body : "",
    toEmail: typeof o.toEmail === "string" ? o.toEmail : undefined,
    context: typeof o.context === "string" ? o.context : undefined,
    createdAt,
    updatedAt,
  };
}

export function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  const raw = safeParse<unknown[]>(localStorage.getItem(KEYS.drafts), []);
  return raw.map((item) => normalizeDraft(item)).filter((d): d is Draft => d !== null);
}

export function saveDrafts(list: Draft[]): void {
  localStorage.setItem(KEYS.drafts, JSON.stringify(list));
}

export function upsertDraft(draft: Draft): void {
  const list = loadDrafts();
  const i = list.findIndex((d) => d.id === draft.id);
  if (i >= 0) list[i] = draft;
  else list.unshift(draft);
  saveDrafts(list);
}

export function deleteDraft(id: string): void {
  saveDrafts(loadDrafts().filter((d) => d.id !== id));
}

export function loadContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  return safeParse<Contact[]>(localStorage.getItem(KEYS.contacts), []);
}

export function saveContacts(list: Contact[]): void {
  localStorage.setItem(KEYS.contacts, JSON.stringify(list));
}

export function upsertContact(contact: Contact): void {
  const list = loadContacts();
  const i = list.findIndex((x) => x.id === contact.id);
  if (i >= 0) list[i] = contact;
  else list.unshift(contact);
  saveContacts(list);
}

export function deleteContact(id: string): void {
  saveContacts(loadContacts().filter((c) => c.id !== id));
}

function normalizeResearch(raw: unknown): DeepResearchSnapshot | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (typeof r.url !== "string" || typeof r.fetchedAt !== "string") return undefined;
  const source = r.source === "llm" || r.source === "heuristic" ? r.source : "heuristic";
  return {
    url: r.url,
    fetchedAt: r.fetchedAt,
    mainOffer: typeof r.mainOffer === "string" ? r.mainOffer : "",
    newsHook: typeof r.newsHook === "string" ? r.newsHook : "",
    industryProblems: typeof r.industryProblems === "string" ? r.industryProblems : "",
    contactPerson: typeof r.contactPerson === "string" ? r.contactPerson : "",
    source,
  };
}

const defaultProfile: Profile = { displayName: "", company: "" };

export function loadProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  return {
    ...defaultProfile,
    ...safeParse<Partial<Profile>>(localStorage.getItem(KEYS.profile), {}),
  };
}

export function saveProfile(p: Profile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(p));
}

export function loadStyleNotes(): string {
  if (typeof window === "undefined") return "";
  let raw = localStorage.getItem(KEYS.style);
  if (raw === null) raw = localStorage.getItem(KEYS.styleLegacy);
  const parsed = safeParse<{ text?: string }>(raw, { text: "" });
  return typeof parsed.text === "string" ? parsed.text : "";
}

export function saveStyleNotes(text: string): void {
  localStorage.setItem(KEYS.style, JSON.stringify({ text }));
}

export function countDraftsByType(type: DraftType): number {
  return loadDrafts().filter((d) => d.type === type).length;
}

export function countDraftsInLastDays(type: DraftType, days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return loadDrafts().filter(
    (d) => d.type === type && new Date(d.updatedAt).getTime() >= cutoff
  ).length;
}

export function countContacts(): number {
  return loadContacts().length;
}

export function getDraftActivityLast7Days(): DraftDayActivity[] {
  if (typeof window === "undefined") return [];

  const drafts = loadDrafts();
  const result: DraftDayActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const start = d.getTime();
    const end = start + 24 * 60 * 60 * 1000;
    const count = drafts.filter((dr) => {
      const t = new Date(dr.updatedAt).getTime();
      return t >= start && t < end;
    }).length;
    result.push({
      dateKey: d.toISOString().slice(0, 10),
      labelShort: d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric" }),
      count,
    });
  }
  return result;
}

function normalizeCampaign(raw: unknown): Campaign | null {
  if (!raw || typeof raw !== "object") return null;

  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : "";
  if (!id) return null;

  const tone = o.tone as CampaignTone;
  if (!["formell", "locker", "neutral"].includes(tone)) return null;

  const status = o.status as CampaignStatus;
  if (!["draft", "waiting_reply", "action_required", "completed"].includes(status)) {
    return null;
  }

  const fuRaw = o.followUpCount;
  const followUpCount = fuRaw === 1 || fuRaw === 2 || fuRaw === 3 ? fuRaw : 1;

  const pkg = o.package;
  if (!pkg || typeof pkg !== "object") return null;
  const p = pkg as Record<string, unknown>;

  return {
    id,
    title: typeof o.title === "string" ? o.title : "Kampagne",
    status,
    audience: typeof o.audience === "string" ? o.audience : "",
    offer: typeof o.offer === "string" ? o.offer : "",
    tone,
    taboos: typeof o.taboos === "string" ? o.taboos : "",
    followUpCount,
    package: {
      erstmailBetreff: typeof p.erstmailBetreff === "string" ? p.erstmailBetreff : "",
      erstmailBody: typeof p.erstmailBody === "string" ? p.erstmailBody : "",
      followUp1: typeof p.followUp1 === "string" ? p.followUp1 : "",
      followUp2: typeof p.followUp2 === "string" ? p.followUp2 : "",
      followUp3: typeof p.followUp3 === "string" ? p.followUp3 : "",
      checklist: typeof p.checklist === "string" ? p.checklist : "",
    },
    research: normalizeResearch(o.research),
    createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
  };
}

export function loadCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  const raw = safeParse<unknown[]>(localStorage.getItem(KEYS.campaigns), []);
  return raw.map((item) => normalizeCampaign(item)).filter((c): c is Campaign => c !== null);
}

function saveCampaigns(list: Campaign[]): void {
  localStorage.setItem(KEYS.campaigns, JSON.stringify(list));
}

export function upsertCampaign(campaign: Campaign): void {
  const list = loadCampaigns();
  const i = list.findIndex((c) => c.id === campaign.id);
  if (i >= 0) list[i] = campaign;
  else list.unshift(campaign);
  saveCampaigns(list);
}

export function deleteCampaign(id: string): void {
  saveCampaigns(loadCampaigns().filter((c) => c.id !== id));
}

export function buildCampaignPackage(input: {
  audience: string;
  offer: string;
  tone: CampaignTone;
  taboos: string;
  followUpCount: 1 | 2 | 3;
  research?: DeepResearchSnapshot | null;
}): CampaignPackage {
  const { audience, offer, tone, taboos, followUpCount, research } = input;
  const greeting =
    tone === "formell" ? "Mit freundlichen Gruessen" : tone === "locker" ? "Viele Gruesse" : "Beste Gruesse";
  const locker = tone === "locker";

  const hostHint = research
    ? (() => {
        try {
          return new URL(research.url).hostname.replace(/^www\./, "");
        } catch {
          return "";
        }
      })()
    : "";

  const subject =
    (research?.mainOffer && hostHint
      ? `${hostHint.slice(0, 40)} - ${research.mainOffer.slice(0, 35)}`
      : offer.trim().slice(0, 60)) || "Kurze Vorstellung - passend fuer Sie";

  const tabooLine = taboos.trim()
    ? `\n\nBitte vermeiden im Gespraech: ${taboos.trim()}`
    : "";

  const researchBlock = research
    ? `${locker ? "Ich habe mir eure Website angesehen" : "Ich habe mir Ihre Website angesehen"} (${hostHint || "Website"}): ${research.mainOffer.slice(0, 350)}
${locker ? "Passt aktuell" : "Passt aktuell"}: ${research.newsHook.slice(0, 400)}
${locker ? "Thema, das ich oft" : "Ein Thema, das ich oft"} bei aehnlichen Betrieben sehe: ${research.industryProblems.slice(0, 350)}
Als Ansprechpartner habe ich notiert: ${research.contactPerson.slice(0, 200)}

`
    : "";

  const erstmailBody = `Hallo,

${researchBlock}ich melde mich, weil ich ${audience.trim() || "..."} besonders gut unterstuetzen kann.
${offer.trim() || "Kurz zu meinem Angebot: ..."}

${
  tone === "formell"
    ? "Ich freue mich auf Ihre Rueckmeldung."
    : tone === "locker"
      ? "Melde dich gern, wenn es passt - oder stell mir eine Frage."
      : "Bei Interesse freue ich mich auf einen kurzen Austausch."
}

${greeting}${tabooLine}`;

  const fu1 = `${locker ? "Hey," : "Hallo,"}

${
  locker
    ? `ich wollte nachhaken: Konntest du mein Angebot zu "${offer.trim().slice(0, 80) || "..."}" schon sichten? Kurze Rueckmeldung reicht.`
    : `ich wollte kurz nachhaken: Konnten Sie mein Angebot zu "${offer.trim().slice(0, 80) || "..."}" schon sichten?`
}

${greeting}`;

  const fu2 = `Hallo,

letzte kurze Nachfrage von meiner Seite - passt das Thema "${offer.trim().slice(0, 60) || "..."}" aktuell, oder soll ich mich spaeter nochmal melden?

${greeting}`;

  const fu3 = `Hallo,

ich gehe davon aus, dass es zeitlich gerade nicht passt. Wenn es spaeter wieder relevant wird, antworte einfach auf diese Mail.

${greeting}`;

  const checklist = `Vor dem Absenden pruefen:
- Empfaenger und Anrede
- Keine Versprechen, die ${locker ? "du" : "Sie"} nicht halten ${locker ? "kannst" : "koennen"}
- Betreff klar und spezifisch
${taboos.trim() ? `- Tabus beachtet: ${taboos.trim()}` : ""}
${
  research
    ? `- Recherche (${research.source === "llm" ? "KI" : "Heuristik"}) vom ${new Date(research.fetchedAt).toLocaleString("de-DE")} kurz gegen Impressum / Website geprueft`
    : ""
}
- Follow-up ${followUpCount}x eingeplant`;

  return {
    erstmailBetreff: subject,
    erstmailBody,
    followUp1: fu1,
    followUp2: fu2,
    followUp3: fu3,
    checklist,
  };
}