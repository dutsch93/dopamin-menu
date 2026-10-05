# Aufgaben v7 – Modul `identity`

*Übersicht und Begründungen: `tasks/plan.md` · Spezifikation: `docs/specs/SPEC-identity.md`*

**Standard-Prüfung für jede Aufgabe:**
- `npm test` grün
- `npm run build` ohne Fehler
- `npm run lint`: nicht mehr Meldungen als der Ausgangswert (6 Fehler, 2 Warnungen in altem Code)
- Keine Emojis, alle Icons in `ICON_NAMES`
- `git grep -n "eyJ\|service_role\|SUPABASE_ANON_KEY=" -- ':!.env.example'` findet keinen Schlüssel
- Texte und Kommentare auf Deutsch

---

## Phase A: Fundament

### Task 0: Supabase-Projekt einrichten (Anh)

**Beschreibung:** Anh legt das Supabase-Projekt an und stellt den Login per Code ein, Schritt für Schritt nach `docs/specs/supabase-einrichtung.md`. Claude darf keine Konten anlegen und keine Zugangsdaten bei fremden Diensten eingeben.

**Akzeptanzkriterien:**
- [ ] Projekt in Region Frankfurt, E-Mail-Login aktiv
- [ ] E-Mail-Vorlagen auf Deutsch mit `{{ .Token }}`, Code gilt 5 Minuten, 6 Stellen
- [ ] Projekt-URL und anon key liegen in `.env.local` (lokal) und in Vercel (Preview + Production)

**Prüfung:** Claude prüft nur, ob `.env.local` existiert und die Variablen gesetzt sind, ohne die Werte auszugeben.
**Abhängigkeiten:** keine · **Umfang:** – (Einstellungen, kein Code)

---

### Task 1: Vitest einrichten und reine Funktionen nach `src/logic.js`

**Beschreibung:** `vitest` als Dev-Dependency, Skripte `test` und `test:watch`. `ymd`, `parseYmd`, `addDays`, `daysBetween`, `planDue`, `cleanTasks`, `isYmd` und `BREAKER_CATS` ziehen von `App.jsx` nach `src/logic.js` und werden in `App.jsx` importiert. Die bisherigen Prüfskripte (25 Fälle) werden zu Vitest-Tests in `src/logic.test.js`.

**Akzeptanzkriterien:**
- [ ] `npm test` führt mindestens die 25 bisherigen Fälle aus, alle grün
- [ ] App verhält sich unverändert (Breaker: zerlegen, abhaken; Home: Dein Fokus)
- [ ] `App.jsx` enthält die verschobenen Funktionen nicht mehr doppelt

**Prüfung:** `npm test`, `npm run build`, Lint; Klicktest Breaker (Anh)
**Abhängigkeiten:** keine · **Dateien:** `package.json`, `src/logic.js`, `src/logic.test.js`, `src/App.jsx` · **Umfang:** S

---

## ✅ Checkpoint A
- [ ] Tests grün, App unverändert, Commit auf `feature/v7`

---

## Phase B: Login

### Task 2: Supabase anbinden und Konfiguration prüfen

**Beschreibung:** `@supabase/supabase-js` installieren. Client außerhalb der Komponente mit `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`. Fehlen die Werte, zeigt die App eine klare Entwickler-Meldung. Eine `.env.example` mit Platzhaltern kommt ins Repository.

**Akzeptanzkriterien:**
- [ ] Mit `.env.local`: App startet normal (noch ohne Login-Gate)
- [ ] Ohne `.env.local`: verständliche Meldung statt leerer Seite
- [ ] Kein echter Schlüssel im Repository

**Prüfung:** Build mit und ohne Variablen; `git grep` auf Schlüssel
**Abhängigkeiten:** Task 0, Task 1 · **Dateien:** `package.json`, `src/App.jsx`, `.env.example` · **Umfang:** XS

---

### Task 3: Login-Gate: E-Mail → Code → App

**Beschreibung:** Sitzung beim Start laden (`getSession`, `onAuthStateChange`), kurzer Lade-Zustand. Ohne Sitzung nur der Login-Bildschirm: E-Mail eingeben → `signInWithOtp` → Code-Feld (Hinweis „gilt 5 Minuten“) → bei 6 Ziffern automatisch `verifyOtp` → App (bzw. Onboarding bei neuen Nutzern). Neue Funktionen in `logic.js` mit Tests: `isValidEmail`, `cleanCode`, `authErrorText`.

**Akzeptanzkriterien:**
- [ ] Ohne Sitzung ist nichts von der App sichtbar (kein Footer, kein Onboarding)
- [ ] Neue E-Mail → nach Code ins Onboarding; bekannte E-Mail → direkt in die App, lokale Daten unverändert
- [ ] Neuladen → weiterhin angemeldet

**Prüfung:** Vitest für die neuen Funktionen; Klicktest Anh (neue und bekannte E-Mail, Neuladen)
**Abhängigkeiten:** Task 2 · **Dateien:** `src/App.jsx`, `src/logic.js`, `src/logic.test.js` · **Umfang:** M

---

### Task 4: Erneut senden, Fehlerfälle, Barrierefreiheit

**Beschreibung:** „Code erneut senden“ nach 60 s mit Countdown, „Andere E-Mail-Adresse“. Freundliche Meldungen für falschen Code, abgelaufenen Code (mit direktem „Neuen Code senden“), zu viele Anfragen und offline. Labels, `role="alert"` für Fehler, Fokus nach jedem Schritt, `autoComplete="email"` bzw. `"one-time-code"`, `inputMode="numeric"`.

**Akzeptanzkriterien:**
- [ ] Jeder Fehlerfall zeigt einen deutschen Satz, und die App bleibt bedienbar
- [ ] Countdown korrekt, Button erst danach aktiv
- [ ] Komplett mit Tastatur bedienbar, Kontraste mind. 4,5:1

**Prüfung:** Vitest (`authErrorText`, Countdown); Klicktest Anh (falscher Code, Flugmodus, zu früh erneut senden)
**Abhängigkeiten:** Task 3 · **Dateien:** `src/App.jsx`, `src/logic.js`, `src/logic.test.js` · **Umfang:** S

---

### Task 5: Konto-Panel im Header mit Abmelden

**Beschreibung:** Personen-Icon neben der Glocke (`aria-label="Konto"`). Öffnet ein Panel im Stil des Benachrichtigungs-Panels mit der E-Mail-Adresse und „Abmelden“ (`signOut`). Lokale App-Daten bleiben in diesem Modul beim Abmelden erhalten.

**Akzeptanzkriterien:**
- [ ] Panel zeigt die richtige E-Mail, „Abmelden“ führt zum Login-Bildschirm
- [ ] Nach erneutem Login sind die lokalen Daten noch da
- [ ] Glocken-Panel und Konto-Panel sind nie gleichzeitig offen

**Prüfung:** Klicktest Anh
**Abhängigkeiten:** Task 3 · **Dateien:** `src/App.jsx` · **Umfang:** S

---

## ✅ Checkpoint B: Modul `identity` fertig
- [ ] Klicktest-Checkliste (lokal + Vercel-Vorschau, iPhone: Code-Vorschlag der Tastatur)
- [ ] `SPEC-identity.md` abgeglichen, CLAUDE.md um Abschnitt „Login“ ergänzt
- [ ] Push `feature/v7` (Vorschau). **Kein** Merge nach `main` (erst nach allen drei Modulen)
- [ ] Danach: Spezifikation `cloud-sync`
