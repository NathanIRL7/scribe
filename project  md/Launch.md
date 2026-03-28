# Launch & Woche – Scribe / FreelancerOS

*Lebendes Dokument: Stand, Ziele, was fehlt bis Launch. Bei Bedarf wöchentlich anpassen.*

**Letzte Anpassung:** _(Datum hier eintragen)_

---

## Was „Launch“ diesmal heißt

| Option | Bedeutung (ankreuzen oder umschreiben) |
|--------|----------------------------------------|
| **Soft Launch** | Erste echte Nutzer / Freunde, noch nicht öffentlich beworben |
| **Öffentlich** | Link teilen, Landing offen, ihr seid bereit für Fremde |
| **Nur ich** | Deployment + stabil für dich, kein Marketing |

**Unsere Definition in einem Satz:**  
_(z. B.: „Launch = deployed auf Vercel, Login mit Supabase, Home mit Hero, Kernflows ohne rote Fehler.“)_

---

## Haben wir schon (Kurz)

| Thema | Stand |
|-------|--------|
| Next.js App, Dashboard, Sidebar (gruppiert) | ja |
| Auth-Seite + Supabase-Client | ja (braucht echte `.env.local` für Live) |
| Bereiche: Profil, Schreibstil, Kontakte, CRM, E-Mail-Flows, Verlauf | UI + viel **lokal** (`scribeLocalStorage`) |
| Dashboard Home | KPIs + Chart + **Hero** (Prompt-Einstieg, wenn umgesetzt) |
| Warteliste | Formular oft noch **Demo** (nicht persistent) – in `PROJECT-STATUS.md` nachlesen |
| KI / MCP / Google OAuth | größtenteils **geplant**, nicht Kern für „minimaler Launch“ |
| Deployment (Vercel o.ä.) | oft noch **offen** |

*Details:* siehe `PROJECT-STATUS.md`.

---

## Muss rein bis Launch (Checkliste)

_Alles was **ohne** ihr euch den Launch nicht zutraut. Abhaken, wenn erledigt._

- [ ] **Deployment:** App erreichbar (z. B. Vercel), Build grün
- [ ] **Umgebung:** `NEXT_PUBLIC_SUPABASE_*` in Produktion gesetzt
- [ ] **Auth:** Registrieren/Login funktioniert live (inkl. Redirect nach Login)
- [ ] **Abmelden** funktioniert (Session wirklich weg)
- [ ] **MCP** einrichten mit den wichtigsten apps 
- [ ] **AI** einbauen mit einen agenten
- [ ] **Keine Showstopper-Bugs** auf den 2–3 Hauptwegen (Home → ein Bereich → zurück)
- [ ] **Datenschutz minimal:** Impressum/Datenschutz-Link oder „noch in Arbeit“ bewusst entscheiden
- [ ] _(weitere Punkte, z. B. Warteliste in DB, wenn Launch = öffentlich)_

---

## Diese Woche – Ziele (max. 3)

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

## MVP vs. Launch (Merksatz)

| | **MVP** | **Launch** |
|---|---------|------------|
| **Fokus** | Kernnutzen geht irgendwie | Nutzer können es **zuverlässig** benutzen |
| **Typisch** | Features fehlen, Bugs ok im Kleinen | Keine roten Crashs auf Hauptpfaden, Auth + Deploy klar |

*Ihr könnt „MVP“ schon erreicht haben – Launch ist oft nochmal: Stabilität + Hosting + echte Keys.*

---

## Notizen / Freitext

_(Ideen, Blocker, was gut lief – alles was nicht in Tabellen passt.)_
