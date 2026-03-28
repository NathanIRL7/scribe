# GitHub Issues – nur Follow-ups zu **heutigem** Stand (24.03.2025)

Zum **Einpflegen** in GitHub: jeweils „New issue“ → Titel + Beschreibung kopieren.

*(Nichts für „Code von gestern“ – das bleibt in deinem eigenen Backlog.)*

---

## Issue 1 – Supabase: Entwürfe & Kontakte statt nur localStorage

**Titel:** `Supabase: Entwürfe, Kontakte, Profil & Schreibstil persistieren`

**Beschreibung:**

```markdown
## Kontext
Wir haben `src/lib/scribeLocalStorage.ts` und die Dashboard-Bereiche (Kalt-Email, Follow-up, Antwort, Verlauf, Kontakte, Profil, Schreibstil). Daten liegen aktuell nur im Browser.

## Ziel
- Tabellen in Supabase (oder ein Schema) für: Entwürfe, Kontakte, Profilfelder, Schreibstil-Text.
- Beim eingeloggten User: Lesen/Schreiben über Supabase.
- Optional später: einmalige Migration aus localStorage nach Login.

## Akzeptanz
- [ ] CRUD für mindestens Entwürfe + Kontakte über Supabase
- [ ] RLS so, dass nur der eigene User seine Zeilen sieht
- [ ] Build & Auth-Flow funktionieren mit `.env.local`
```

---

## Issue 2 – Session im Dashboard: echte E-Mail + Abmelden

**Titel:** `Dashboard: User-E-Mail in Sidebar + supabase.auth.signOut()`

**Beschreibung:**

```markdown
## Kontext
Sidebar zeigt noch Platzhalter `freelancer@example.de`; „Zur Startseite“ ersetzt nicht echtes Abmelden.

## Ziel
- E-Mail (oder Name) aus `supabase.auth.getSession()` / User-Metadata anzeigen.
- Button „Abmelden“ (oder klar getrennt von „Zur Startseite“) ruft `supabase.auth.signOut()` auf und aktualisiert die App-Ansicht.

## Akzeptanz
- [ ] Anzeige entspricht dem eingeloggten Account
- [ ] Nach Abmelden: Landing / Auth wie in `ScribeApp` vorgesehen
```

---

## Issue 3 – Verlauf: Entwurf bearbeiten (nicht nur löschen)

**Titel:** `Verlauf: gespeicherten Entwurf öffnen und bearbeiten`

**Beschreibung:**

```markdown
## Kontext
`VerlaufSection` listet Entwürfe und erlaubt Löschen. Es gibt keinen Weg, einen Entwurf wieder in Kalt-Email/Follow-up/Antwort zu laden.

## Ziel
- Pro Entwurf: Aktion „Bearbeiten“ → passendes Formular mit vorausgefüllten Feldern.
- Speichern aktualisiert denselben Datensatz (gleiche `id`), nicht immer neuen Entwurf.

## Akzeptanz
- [ ] Bearbeiten für alle drei Typen (`kalt-email`, `follow-up`, `antwort`)
- [ ] `updatedAt` wird gesetzt
```

---

## Issue 4 – Home-KPI „Kunden“: echte Logik oder Label anpassen

**Titel:** `Dashboard Home: KPI „Kunden“ definieren oder umbenennen`

**Beschreibung:**

```markdown
## Kontext
In `DashboardHome` ist `kundenAusEmail` noch fest `0` (Platzhalter). Kontakte- und Entwurf-Zahlen kommen schon aus localStorage.

## Ziel
Entweder:
- echte Definition (z. B. Kontakte mit Tag „Kunde“ oder eigenes Feld), **oder**
- Label/Hint so anpassen, dass klar ist, dass der Wert noch nicht befüllt ist.

## Akzeptanz
- [ ] Kein irreführendes „0“ ohne Erklärung, oder sinnvolle Zählung
```

---

## Kurz-Anleitung GitHub (ohne `gh` CLI)

1. Repo auf GitHub öffnen → **Issues** → **New issue**
2. Titel + Beschreibung aus oben einfügen (Markdown-Blöcke kannst du ohne die äußeren ```-Zeilen einfügen, wenn du nur den Text willst)
3. Labels optional: `enhancement`, `backend`, `auth`, `ux`
