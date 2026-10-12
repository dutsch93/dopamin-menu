# Spec: identity – Login mit E-Mail und Code

*Modul 1 von 3, siehe `v7-capability-map.md`. Status: **freigegeben** am 05.10.2026, **umgesetzt und abgenommen** am 12.10.2026 (Branch `feature/v7`)*

## Ziel

Jede Person meldet sich mit ihrer **E-Mail-Adresse und einem 6-stelligen Code** an, bevor sie die App nutzen kann. Es gibt kein Passwort und keine getrennte Registrierung: Die erste Anmeldung legt das Konto automatisch an. Danach bleibt man angemeldet, bis man sich abmeldet.

**Für wen:** Menschen mit ADHS. Der Login muss deshalb **schnell, freundlich und fehlertolerant** sein: wenige Schritte, klare deutsche Texte, kein Passwort, das man vergisst.

**Dieses Modul speichert noch keine App-Daten in der Cloud.** Die bleiben vorerst im localStorage. Das übernimmt `cloud-sync`.

## Ablauf (User Stories)

1. **Ich bin nicht angemeldet:** Statt der App sehe ich einen Anmelde-Bildschirm (Oktopus + Fuchs, Titel „Dopamin-Menü“) mit dem Feld „Deine E-Mail-Adresse“ und dem Button „Code senden“.
2. **Ich gebe meine E-Mail ein und tippe „Code senden“:** Ich sehe „Wir haben dir einen 6-stelligen Code an *anh@…* geschickt. Er gilt 5 Minuten. Schau auch im Spam-Ordner nach.“ und ein Feld für den Code.
3. **Ich gebe den Code ein:** Sind 6 Ziffern eingegeben, meldet mich die App sofort an (ohne extra Button-Tipp, ein Button „Anmelden“ ist trotzdem da). Danach geht es weiter wie bisher: neue Nutzer ins Onboarding, bestehende direkt in die App.
4. **Der Code ist falsch oder abgelaufen:** freundliche Meldung („Der Code stimmt leider nicht. Prüf ihn noch mal oder fordere einen neuen an.“), das Feld wird geleert und bekommt den Fokus.
5. **Ich habe keinen Code bekommen:** „Code erneut senden“ ist nach 60 Sekunden möglich, mit sichtbarem Countdown. „Andere E-Mail-Adresse“ führt zurück zu Schritt 1.
6. **Ich lade die Seite neu oder öffne die App morgen wieder:** Ich bin weiterhin angemeldet.
7. **Ich will mich abmelden:** Über ein Konto-Symbol im Header öffnet sich ein kleines Panel mit meiner E-Mail-Adresse und „Abmelden“. Danach sehe ich wieder den Anmelde-Bildschirm.

## Akzeptanzkriterien

- [x] Ohne gültige Sitzung ist **kein Teil der App** erreichbar (auch nicht Onboarding oder Footer)
- [x] E-Mail wird vor dem Senden geprüft (Format), Fehler direkt am Feld
- [x] Code-Feld: nur Ziffern, `inputMode="numeric"`, `autoComplete="one-time-code"` (iPhone schlägt den Code aus der Mail vor), automatische Anmeldung bei 6 Ziffern
- [x] „Code erneut senden“ erst nach 60 Sekunden, Countdown sichtbar
- [x] Alle Fehlermeldungen auf Deutsch, verständlich, ohne Fachbegriffe: falscher/abgelaufener Code, zu viele Versuche, keine Internetverbindung, unbekannter Fehler
- [x] Sitzung bleibt über Neuladen und Neustart erhalten (Supabase speichert sie im Browser und erneuert sie automatisch)
- [x] Abmelden beendet die Sitzung und zeigt den Anmelde-Bildschirm. **In diesem Modul bleiben die lokalen App-Daten beim Abmelden erhalten** (es gibt noch keine Cloud-Kopie). Ab `cloud-sync` wird das geändert.
- [x] Barrierefreiheit: Labels an allen Feldern, Fehler werden vorgelesen (`role="alert"`), sinnvoller Fokus nach jedem Schritt, Kontraste mind. 4,5:1, Bedienung ohne Maus möglich
- [x] Optik passt zur App: Fredoka, Pastellfarben, Maskottchen, Material Symbols, keine Emojis
- [x] Ohne konfigurierte Supabase-Zugangsdaten zeigt die App eine klare Entwickler-Meldung statt eines leeren Bildschirms

## Tech-Stack

- React 19 + Vite 8 (unverändert), alles in `src/App.jsx`
- **Neu:** `@supabase/supabase-js` v2 (aktuelle Version beim Installieren)
  - Code anfordern: `supabase.auth.signInWithOtp({ email })` (legt beim ersten Mal das Konto an)
  - Code prüfen: `supabase.auth.verifyOtp({ email, token, type: "email" })`
  - Sitzung: `supabase.auth.getSession()` beim Start, `supabase.auth.onAuthStateChange(...)` für Änderungen
  - Abmelden: `supabase.auth.signOut()`
- **Neu (Entwicklung):** `vitest` für automatische Tests
- **Zugangsdaten** als Umgebungsvariablen:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (Supabase „Publishable key“, `sb_publishable_…`; der alte „anon key“ ist bei Supabase als veraltet markiert)
  - lokal in `.env.local` (wird durch `*.local` in `.gitignore` nicht eingecheckt)
  - in Vercel unter Project → Settings → Environment Variables (für Preview **und** Production)

## Einrichtung bei Supabase (macht Anh, mit Anleitung)

1. Projekt anlegen, **Region: Frankfurt (eu-central-1)**
2. Authentication → Providers → **Email** aktiv, „Confirm email“ an
3. Authentication → Email Templates → „Magic Link“ **und** „Confirm signup“: Text auf Deutsch, mit dem Code `{{ .Token }}` statt eines Links
4. Authentication → Settings: Ablaufzeit des Codes auf **5 Minuten** (300 Sekunden), Code-Länge **6**
5. Project Settings → API Keys: Projekt-URL und Publishable key kopieren → `.env.local` und Vercel. Details: `supabase-einrichtung.md`

## Befehle

```
Entwickeln:   npm run dev
Bauen:        npm run build
Lint:         npm run lint
Tests:        npm test          (neu: vitest run)
Tests live:   npm run test:watch (neu: vitest)
```

## Projektstruktur

```
src/App.jsx        ← App inkl. Login-Bildschirm und Supabase-Anbindung (wie bisher alles in einer Datei)
src/logic.js       ← NEU: reine, testbare Funktionen ohne React
src/logic.test.js  ← NEU: Vitest-Tests für logic.js
.env.local         ← NEU, lokal, nicht im Git: Supabase-URL und Publishable key
docs/specs/        ← Bauplan und Spezifikationen v7
```

## Code-Stil

Wie bisher: kompakter Inline-Stil, Styles im `S`-Objekt, deutsche Kommentare, deutsche Texte. Beispiel:

```jsx
// Anmelde-Schritt 2: Code prüfen. Bei 6 Ziffern automatisch absenden.
const verifyCode=async code=>{setAuthBusy(true);setAuthErr(null);
  const{error}=await supabase.auth.verifyOtp({email:authEmail,token:code,type:"email"});
  setAuthBusy(false);if(error){setAuthErr(authErrorText(error));setAuthCode("");codeRef.current?.focus();}};
```

Fehlertexte kommen aus **einer** Funktion `authErrorText(error)`, die Supabase-Fehler auf deutsche Sätze abbildet (testbar in `logic.js`).

## Teststrategie

| Was | Wie |
|---|---|
| E-Mail-Prüfung, Code-Prüfung (6 Ziffern), Fehlertexte, Countdown-Berechnung | **Vitest**, automatisch (`npm test`) |
| Bestehende Logik (`planDue`, `cleanTasks`) | wandert nach `logic.js` und bekommt Vitest-Tests (ersetzt die Prüfskripte im Scratchpad) |
| Echter Login gegen Supabase | **Klicktest durch Anh** (Claude darf keine Anmeldedaten bei fremden Diensten eingeben). Checkliste im Aufgabenplan. Versand über Brevo (siehe Entscheidung 4). Ohne eigene Domain im Spam-Ordner nachsehen. |
| Build, Lint | vor jedem Commit |

## Grenzen

- **Immer:** Zugangsdaten nur über `import.meta.env`. Deutsche, freundliche Texte. Build, Lint und Tests vor jedem Commit. Arbeiten auf einem Feature-Branch.
- **Erst fragen:** weitere Dependencies, Änderungen an Supabase-Einstellungen, Datenbank-Tabellen (kommen erst in `cloud-sync`), Push nach `main`.
- **Niemals:** den `service_role`-Schlüssel im Browser oder im Git. `.env.local` einchecken. E-Mail-Adressen oder Codes in die Konsole schreiben. Codes speichern. Live gehen, bevor alle drei Module fertig sind.

## Erfolgskriterien

1. Eine neue E-Mail-Adresse kann sich mit Code anmelden und landet im Onboarding.
2. Eine bekannte E-Mail-Adresse landet nach dem Code direkt in der App, ihre lokalen Daten sind unverändert da.
3. Neuladen → weiterhin angemeldet. Abmelden → Anmelde-Bildschirm.
4. Falscher Code, abgelaufener Code, zu früh „erneut senden“ und Offline zeigen jeweils eine verständliche deutsche Meldung, und die App bleibt bedienbar.
5. `npm test`, `npm run build` und `npm run lint` laufen (Lint: nicht mehr Fehler als vorher).
6. Im Git-Repository ist kein Schlüssel zu finden.

## Entscheidungen (05.10.2026)

1. **Code gilt 5 Minuten** (Anhs Wahl; Empfehlung war 15). Deshalb steht die Gültigkeit sichtbar im Login-Bildschirm. **Nachtrag (11.10.):** Supabase meldet für falschen und abgelaufenen Code denselben Fehler (`otp_expired`, „Token has expired or is invalid“). Deshalb gibt es **eine** gemeinsame Meldung: „Der Code stimmt leider nicht oder ist schon abgelaufen (er gilt 5 Minuten). Prüf ihn noch mal oder fordere einen neuen an.“ Darunter steht der Link „Code erneut senden“.
2. **`src/logic.js` ist erlaubt** für reine, testbare Funktionen ohne React. Die Oberfläche bleibt komplett in `App.jsx`.
3. **Konto-Symbol im Header** (Personen-Icon neben der Glocke) öffnet ein Panel mit E-Mail und „Abmelden“. `account-privacy` erweitert es später.

4. **E-Mail-Versand über Brevo** (08.10.2026): Supabase erlaubt eigene Vorlagen (und damit den Code `{{ .Token }}` in der Mail) nur mit eigenem SMTP. Gewählt: **Brevo** (EU, kostenlos bis 300 Mails/Tag). Damit gehen Codes an jede Adresse, bis 30 Mails/Stunde.

## Offene Fragen

1. **Eigene Domain:** Bis zum Livegang kommen die Mails von einer bestätigten Einzeladresse und landen oft im Spam. **Vor dem Livegang** muss eine eigene Domain gekauft und in Brevo bestätigt werden (SPF/DKIM/DMARC). Eigene Anleitung folgt.

## Nachtrag 12.10.2026: Lokale Daten pro Konto

Die Sicherheitsprüfung fand: Ein anderes Konto im selben Browser sah nach dem Abmelden die Daten des vorherigen Kontos. Lösung: `switchLocalOwner()` (`logic.js`) bindet die lokalen Daten an die User-ID (`data_owner`). Ein anderes Konto startet leer. Beim Abmelden bleiben die Daten bis `cloud-sync` erhalten, danach werden sie beim Abmelden gelöscht.
