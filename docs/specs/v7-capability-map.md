# Bauplan v7: Konto, Login und Cloud-Sync

*Freigegeben am 05.10.2026. Die Module werden in dieser Reihenfolge spezifiziert und gebaut. Jedes Modul hat eine eigene Spezifikation (`SPEC-<modul>.md` in diesem Ordner).*

## Bewusste Entscheidung: Daten in die Cloud

Bis v6 galt: *„localStorage, kein Backend, kein Account“* und *„Privacy-first: Kein Cloud-Storage ohne explizite Entscheidung“*.
**Am 05.10.2026 hat Anh (Product Owner) entschieden, diese Regel für v7 aufzuheben:**
- **Login ist Pflicht** (E-Mail + 6-stelliger Code, kein Passwort).
- App-Daten werden in einer **Supabase-Datenbank in der EU (Frankfurt)** gespeichert.
- Ziele: mehrere Geräte, Daten nicht verlieren, persönlicher wirken, Grundlage für spätere Features (z.B. Erinnerungen).
- Hingenommen werden die Pflichten: DSGVO (mögliche Gesundheitsdaten, Art. 9), Einwilligung, Datenschutzerklärung, Impressum, Konto löschen und Daten exportieren.

## Module

| Modul | Aufgabe | Baut auf |
|---|---|---|
| `identity` | Login mit E-Mail und Code, angemeldet bleiben, Abmelden. Ohne Login kein Zugang zur App. | – |
| `cloud-sync` | App-Daten in Supabase speichern, lokale Daten beim ersten Login übernehmen (bei Konflikt nachfragen), Abgleich zwischen Geräten, offline weiterarbeiten | `identity` |
| `account-privacy` | Einwilligung beim Registrieren, Datenschutz- und Impressum-Seiten, Daten exportieren, Konto löschen, Name und Begrüßung | `identity`, `cloud-sync` |

**Reihenfolge:** `identity` → `cloud-sync` → `account-privacy`

**Live gehen erst, wenn alle drei Module fertig sind.** Ein Pflicht-Login ohne Einwilligung, ohne Datenschutzerklärung und ohne „Konto löschen“ darf nicht veröffentlicht werden. Bis dahin wird nur auf einem Feature-Branch mit geschützter Vercel-Vorschau gearbeitet.

## Querschnitt (gilt für alle Module)

- **Neue Dependencies (freigegeben):** `@supabase/supabase-js` (Laufzeit), `vitest` (nur Entwicklung, für automatische Tests)
- **Zugangsdaten:** nur die öffentliche Projekt-URL und der öffentliche „Publishable key“ (`sb_publishable_…`) im Browser, als Vite-Umgebungsvariablen. **Niemals** der „Secret key“ (`sb_secret_…`) bzw. der alte „service_role“-Schlüssel im Browser oder im Repository.
- **Konflikt beim ersten Login** (Gerät und Konto haben beide Daten): nachfragen, siehe `SPEC-cloud-sync.md`
- **Nicht in v7:** Erinnerungen per E-Mail/Push, Teilen, Statistiken, echtes Zusammenführen bei gleichzeitigem Bearbeiten auf zwei Geräten (in v7 gewinnt der zuletzt gespeicherte Stand)
