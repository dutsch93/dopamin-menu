# Umsetzungsplan v7 – Modul `identity` (Login mit E-Mail und Code)

*Stand: 05.10.2026 · Spezifikation: `docs/specs/SPEC-identity.md` · Bauplan: `docs/specs/v7-capability-map.md` · Aufgaben: `tasks/todo.md`*
*Branch: `feature/v7`. Live erst, wenn alle drei v7-Module fertig sind.*

## Überblick

Vor jeder Nutzung der App steht ein Login mit E-Mail und 6-stelligem Code (Supabase Auth, EU). Die App-Daten bleiben in diesem Modul noch lokal. Dazu kommen ein echtes Test-Werkzeug (Vitest) und eine Datei `src/logic.js` für reine, testbare Funktionen.

## Abhängigkeiten

```
Task 0 (Anh: Supabase einrichten) ─────────────┐
Task 1 (Vitest + logic.js) ──┐                 │
                             ├─ Task 2 (Supabase-Anbindung, Konfig-Prüfung)
                             │        │
                             │        └─ Task 3 (Login-Gate: E-Mail → Code → App)
                             │                 │
                             │                 ├─ Task 4 (Erneut senden, Fehlerfälle, Barrierefreiheit)
                             │                 └─ Task 5 (Konto-Panel mit Abmelden)
                             └─ (Tests wachsen mit jeder Aufgabe)
```

Task 1 hat keinen Bezug zum Login und senkt das Risiko. Er kommt zuerst, damit alle folgenden Aufgaben echte Tests haben. Task 0 erledigt Anh parallel.

## Architektur-Entscheidungen

- **Supabase-Client einmal außerhalb der Komponente** erzeugen (`createClient(url, publishableKey)`), mit `import.meta.env`. Fehlen die Variablen, zeigt die App eine Entwickler-Meldung statt abzustürzen.
- **Sitzung:** beim Start `getSession()`, danach `onAuthStateChange`. Solange die Sitzung lädt, erscheint ein kurzer Lade-Zustand (Maskottchen), damit der Login-Bildschirm nicht kurz aufblitzt.
- **Login-Gate ganz oben im JSX:** Ohne Sitzung wird nur der Login-Bildschirm gerendert, kein Onboarding, kein Footer. Bestehende Logik bleibt unverändert darunter.
- **Hooks-Regel:** Alle bestehenden `useState`/`useEffect` bleiben unbedingt aufgerufen. Das Gate entscheidet nur, *was gerendert wird*, nicht ob Hooks laufen.
- **Reine Funktionen in `src/logic.js`:** `isValidEmail`, `cleanCode` (nur Ziffern, max. 6), `authErrorText(error)`, `secondsLeft(...)`. Dazu ziehen die vorhandenen Funktionen `ymd`, `parseYmd`, `addDays`, `daysBetween`, `planDue`, `cleanTasks` und `BREAKER_CATS` um. Die Oberfläche bleibt in `App.jsx`.
- **Fehlertexte:** Supabase-Fehler werden über Code/Status/Meldung auf wenige deutsche Sätze abgebildet: falscher Code, abgelaufen, zu viele Anfragen, offline, unbekannt.

## Aufgaben

### Phase A: Fundament
- [x] Task 0: Supabase-Projekt einrichten (**Anh**, mit Anleitung `docs/specs/supabase-einrichtung.md`)
- [x] Task 1: Vitest einrichten, reine Funktionen nach `src/logic.js`, Prüfskripte als echte Tests

### Checkpoint A
- [ ] `npm test` grün, App verhält sich unverändert (kurzer Klicktest Breaker)

### Phase B: Login
- [x] Task 2: Supabase anbinden, Konfigurations-Prüfung, `.env.example`
- [ ] Task 3: Login-Gate: E-Mail → Code → App (glücklicher Weg)
- [ ] Task 4: Erneut senden mit Countdown, Fehlerfälle, Barrierefreiheit
- [ ] Task 5: Konto-Panel im Header mit Abmelden

### Checkpoint B (Modul `identity` fertig)
- [ ] Klicktest-Checkliste durch Anh (lokal und in der Vercel-Vorschau, auch iPhone)
- [ ] Spezifikation abgeglichen, CLAUDE.md um „Login“ ergänzt
- [ ] Danach: Spezifikation `cloud-sync`

## Risiken und Gegenmaßnahmen

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Codes landen ohne eigene Domain im Spam | Mittel (Test-UX) | Versand über Brevo (eigenes SMTP, nötig für Vorlagen mit Code). In der Testphase Spam-Ordner prüfen. **Vor dem Livegang:** eigene Domain in Brevo bestätigen. |
| 5-Minuten-Code läuft während einer Ablenkung ab | Mittel (UX) | Gültigkeit sichtbar anzeigen, eigene Meldung mit direktem „Neuen Code senden“ |
| Schlüssel landet im Git | Hoch | Nur `.env.local` (durch `*.local` ignoriert), `.env.example` ohne echte Werte, Prüfung vor jedem Commit (`git grep`) |
| Login-Gate bricht bestehende Hooks/Onboarding | Hoch | Hooks unverändert lassen, Gate nur im Rendering, Klicktest von Onboarding nach Login |
| Bestehende Live-Nutzer werden ausgesperrt | Hoch | v7 geht erst live, wenn `cloud-sync` die lokalen Daten übernimmt |
| App-Paket wächst durch supabase-js (85 → 142 KB gzip) | Niedrig (ca. 0,3 s mehr Ladezeit auf 4G) | Vorerst hinnehmen. Später Supabase erst nach dem Start nachladen (Code-Splitting), falls nötig. |
| Claude kann den echten Login nicht selbst testen | Mittel | Klare Checkliste für Anh; alles andere automatisch mit Vitest |

## Offene Fragen
- Eigene Domain für den E-Mail-Versand (vor dem Livegang, siehe Spezifikation)
