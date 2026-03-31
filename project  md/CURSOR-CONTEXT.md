# Cursor, Cowork & Kontext

## Wichtigster Satz (immer)

**Dein echtes Projekt ist der Ordner, den du in Cursor geöffnet hast** (z. B. `Documents\Ordnung app\FreelancerOS`). **`qnz` existiert bei dir nicht als normaler Unterordner** – das ist nur ein **versteckter Worktree** unter `.cursor\worktrees\`. Die KI soll **nur** in **deinem geöffneten Projektordner** ändern, nicht in einem Worktree-Pfad, den du gar nicht nutzt.

## Zweck

Der Ordner **`project  md`** (bei dir oft **zwei Leerzeichen** zwischen „project“ und „md“; im Worktree manchmal ein Leerzeichen) ist die **Doku- und Kontext-Schicht** für FreelancerOS / Scribe.  
Agenten lesen hier **vor** größeren Schritten; bei wichtigen Änderungen wird der Ordner **kurz mitgepflegt**.

## Vor Arbeit lesen (Priorität)

| Prio | Datei | Inhalt |
|------|--------|--------|
| 1 | **README.md** (dieser Ordner) | Index, alle Links |
| 2 | **PROJECT-STATUS.md** | Technischer Stand |
| 3 | **MENTOR-REGELN.md** | Lern- & Arbeitsregeln |
| 4 | **COMMANDS-UND-GIT.md** | Git, npm, Sync |
| 5 | **CURSOR-CONTEXT.md** (diese Datei) | Regeln für KI |

Zusätzlich: **`PROJECT-STATUS.md`** im **Repo-Root**, falls vorhanden.

## Nach großen Änderungen aktualisieren

- Neues Feature / API / Architektur → **PROJECT-STATUS.md** (Stichpunkte).
- Neue KI-/Workflow-Regel → **CURSOR-CONTEXT.md** oder README verlinken.
- Trivial-Fix (Tippfehler, eine Zeile) → **keine** Pflicht.

## Cursor Rule

Technische Verpflichtung: **`.cursor/rules/project-md-context.mdc`** (`alwaysApply: true`).
