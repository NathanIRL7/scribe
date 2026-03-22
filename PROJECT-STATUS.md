# Scribe / FreelancerOS – Stand & offene Punkte

*Stand: Übersicht was fertig ist und was noch fehlt.*

---

## Übersichtstabelle

| Bereich | Status | Was fehlt / nächster Schritt |
|---------|--------|------------------------------|
| **Next.js App (`src/`)** | Fertig (Grundgerüst) | — |
| **UI-Kit (Button, Input, Card, Sidebar)** | Fertig | Fokus-Ringe, `Card` unterstützt Tastatur |
| **Landing + Dashboard (Layout)** | Fertig (UI/UX-Pass) | Sticky Header, Footer, Modal-UX, Auth-Look |
| **Warteliste (Formular)** | Nur Demo | Speichert **nicht** in DB – nur `setSubmitted(true)` lokal |
| **Warteliste → Supabase** | Offen | Tabelle `waitlist` + `insert` aus `LandingPage` |
| **Login /auth** | Fertig (Grundgerüst) | Funktioniert mit echten Keys in `.env.local` |
| **Supabase Client** | Fertig | Ohne echte URL/Key: Platzhalter (Build geht, Auth nicht echt) |
| **„Anmelden“ auf Landing** | Teilweise | Wechselt nur zur **Dashboard-Ansicht** in der App, **kein** Link zu `/auth` |
| **„Abmelden“ im Dashboard** | Nur UI | Ruft **kein** `supabase.auth.signOut()` auf |
| **E-Mail in Sidebar** | Platzhalter | Fest `freelancer@example.de` – echte User-Mail aus Session |
| **Dashboard: Home** | Fertig | Karten für Kalt-Email / Follow-up |
| **Dashboard: Profil, Schreibstil, Kontakte, …** | Platzhalter | Text „Dieser Bereich wird bald verfügbar sein“ |
| **Kalt-Email / Follow-up / Antwort / Verlauf** | Nicht gebaut | Keine Seiten, keine Logik, kein AI-Text |
| **API-Routen (`/api/...`)** | Keine | — |
| **KI/LLM für E-Mail-Text** | Nicht angebunden | Kein OpenAI o.ä. |
| **Vanilla-Version (`HTML/`, `CSS/`)** | Alt / parallel | Nicht mit Next synchronisiert |
| **Deployment (Vercel o.ä.)** | Offen | Lokal + GitHub, kein Produktions-Host im Dokument |

---

## Empfohlene Reihenfolge (wenn wir „endlich coden“)

1. **`.env.local`** mit echten `NEXT_PUBLIC_SUPABASE_*` Werten (Supabase Dashboard).
2. **Warteliste:** SQL-Tabelle + Insert aus LandingPage.
3. **Landing:** „Anmelden“ → Link zu **`/auth`** (oder eingeloggt → Dashboard).
4. **Dashboard:** echte Session + Abmelden + E-Mail aus User.
5. **Erstes Tool** (z. B. Kalt-Email) mit echter UI + Speicherung.
6. Optional: **KI** später.

---

## Dateien als Referenz

| Thema | Wo |
|-------|-----|
| Startseite | `src/app/page.tsx` → `ScribeApp` |
| Warteliste | `src/app/components/LandingPage.tsx` |
| Dashboard | `src/app/components/Dashboard.tsx` |
| Auth | `src/app/auth/page.tsx` |
| Supabase | `src/lib/supabase.ts`, `.env.local` |
