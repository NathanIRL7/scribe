/**
 * Lokale Daten für Scribe (Browser localStorage).
 * Später durch Supabase ersetzbar – gleiche Konzepte: Entwürfe, Kontakte, Profil.
 */

const KEYS = {
  drafts: "scribe_v1_drafts",
  contacts: "scribe_v1_contacts",
  profile: "scribe_v1_profile",
  style: "scribe_v1_schreibstil",
  /** Legacy-Key aus älteren Versionen */
  styleLegacy: "scribe_v1_style",
  /**Home-Hero: freier Prompt-Text (bis KI andockt) */
  homePrompt: "scribe_v1_home_prompt",
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

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Normalisiert alte gespeicherte Entwürfe (z. B. Tippfehler bei Datum-Feldern). */
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
  try {
    const raw = safeParse<unknown[]>(localStorage.getItem(KEYS.drafts), []);
    return raw
      .map((item) => normalizeDraft(item))
      .filter((d): d is Draft => d !== null);
  } catch {
    return [];
  }
}

export function saveDrafts(list: Draft[]): void {
  try {
    localStorage.setItem(KEYS.drafts, JSON.stringify(list));
  } catch (e) {
    console.error("scribeLocalStorage saveDrafts", e);
    throw e;
  }
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
  try {
    return safeParse<Contact[]>(localStorage.getItem(KEYS.contacts), []);
  } catch {
    return [];
  }
}

export function saveContacts(list: Contact[]): void {
  try {
    localStorage.setItem(KEYS.contacts, JSON.stringify(list));
  } catch (e) {
    console.error("scribeLocalStorage saveContacts", e);
    throw e;
  }
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

const defaultProfile: Profile = { displayName: "", company: "" };

export function loadProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    return {
      ...defaultProfile,
      ...safeParse<Partial<Profile>>(localStorage.getItem(KEYS.profile), {}),
    };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(p: Profile): void {
  try {
    localStorage.setItem(KEYS.profile, JSON.stringify(p));
  } catch (e) {
    console.error("scribeLocalStorage saveProfile", e);
    throw e;
  }
}

export function loadStyleNotes(): string {
  if (typeof window === "undefined") return "";
  try {
    let raw = localStorage.getItem(KEYS.style);
    if (raw === null) raw = localStorage.getItem(KEYS.styleLegacy);
    const parsed = safeParse<{ text?: string }>(raw, { text: "" });
    return typeof parsed.text === "string" ? parsed.text : "";
  } catch {
    return "";
  }
}

export function saveStyleNotes(text: string): void {
  try {
    localStorage.setItem(KEYS.style, JSON.stringify({ text }));
  } catch (e) {
    console.error("scribeLocalStorage saveStyleNotes", e);
    throw e;
  }
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

/** Ein Punkt pro Kalendertag (letzte 7 Tage), Zählung nach `updatedAt` der Entwürfe. */
export type DraftDayActivity = {
  dateKey: string;
  labelShort: string;
  count: number;
};

export function getDraftActivityLast7Days(): DraftDayActivity[] {
  if (typeof window === "undefined") {
    return [];
  }
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
    const labelShort = d.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "numeric",
    });
    result.push({
      dateKey: d.toISOString().slice(0, 10),
      labelShort,
      count,
    });
  }
  return result;
}

export function loadHomePrompt(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(KEYS.homePrompt) ?? "";
  } catch {
    return "";
  }
}

export function saveHomePrompt(text:string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.homePrompt, text);
  } catch (e) {
    console.error("scribeLocalStorage saveHomePrompt", e);
  }
}