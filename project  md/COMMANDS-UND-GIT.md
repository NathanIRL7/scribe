# Scribe / FreelancerOS – Befehle & Git (Schnellreferenz)

*Liegt im Ordner **`project md`** zusammen mit Launch, GIthib Hilfe und anderen Notizen.*

Projektordner (immer zuerst hierhin, wenn das Terminal woanders startet):

```powershell
cd "C:\Users\natha\Documents\Ordnung app\FreelancerOS"
```

Falls `cd` mal nicht erkannt wird (selten): in PowerShell dasselbe mit

```powershell
Set-Location "C:\Users\natha\Documents\Ordnung app\FreelancerOS"
```

---

## Next.js / npm (wichtigste Commands)

| Befehl | Wofür |
|--------|--------|
| `npm run dev` | Entwicklungsserver starten → **http://localhost:3000** |
| `npm run build` | **Alles prüfen** (TypeScript + Build). Vor Release sinnvoll. |
| `npm run start` | Produktionsserver (nach `npm run build`) |
| `npm run lint` | ESLint ausführen |
| `npm install` | Abhängigkeiten installieren / aktualisieren (nach `git pull` o.ä.) |

**Hinweis:** Terminal offen lassen bei `npm run dev`. Beenden: **Strg + C**.

---

## Git & GitHub – Alltag

### Schnellweg (empfohlen)

1. In Cursor: **Strg + S** (Dateien speichern)
2. **Strg + Shift + P** → **Run Task** → **Sync zu GitHub**

Oder im Terminal im Projektordner:

```powershell
npm run sync
```

(`sync` macht grob: `git add` → `commit` mit Nachricht „Auto save“ → `push`)

### Manuell (gleiche Wirkung wie Sync)

```powershell
git add .
git commit -m "Kurze Beschreibung der Änderung"
git push
```

**Wichtig:** Zwischen `commit` und `-m` ist ein **Leerzeichen** → richtig: `git commit -m "Text"` — falsch: `git commit-m`

---

## Git – nur ansehen / prüfen

| Befehl | Bedeutung |
|--------|-----------|
| `git status` | Welche Dateien geändert / neu / schon committed? |
| `git remote -v` | Wo zeigt `origin` hin (GitHub-URL)? |
| `git branch` | Auf welchem Branch bist du? (z. B. `main`) |

---

## GitHub – Code im Browser

- **https://github.com** einloggen → dein Repository öffnen  
- Oder direkt: `https://github.com/DEIN-USERNAME/REPO-NAME`  
- URL für `git remote` endet oft mit **`.git`**, z. B.  
  `https://github.com/NathanIRL7/scribe-wihtout-readme.git`

---

## Einmalig: Remote setzen (wenn noch nicht verbunden)

```powershell
git remote add origin https://github.com/DEIN-USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

Wenn `origin` schon falsch ist: zuerst `git remote remove origin`, dann wieder `git remote add ...`.

---

## Typische Meldungen (kurz erklärt)

| Meldung | Heißt |
|---------|--------|
| `nothing to commit, working tree clean` | Alles committed, nichts Offenes – **okay** |
| `on branch main` (oder `master`) | Aktueller Branch – **okay** |
| `LF will be replaced by CRLF` | Zeilenenden Windows/Linux – meist **harmlos** |
| `please complete authentication in your browser` | GitHub-Anmeldung im Browser abschließen |

---

## Repo privat (Verkauf / nicht öffentlich)

GitHub → Repo → **Settings** → unten **Danger Zone** → **Change visibility** → **Make private**.

---

## `.gitignore` (kurz)

Diese Dinge landen **nicht** im Repo (normal so):

- `node_modules/`
- `.next/`
- `.env*` (Geheimnisse)

Keine API-Keys oder Passwörter in Code committen.

---

## Alte Textdatei

Es gibt zusätzlich **`GIT-SCHNELLREFERENZ.txt`** (kürzere Variante). Diese **`.md`**-Datei ist die ausführlichere Referenz.
