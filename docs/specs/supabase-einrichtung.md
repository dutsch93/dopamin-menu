# Anleitung: Supabase für das Dopamin-Menü einrichten

*Für Anh · Task 0 in `tasks/todo.md` · Dauer: ca. 15–20 Minuten · Stand: 07.10.2026*

Supabase verwaltet ab v7 die Konten (Login per E-Mail-Code) und später die App-Daten. Diese Schritte machst du selbst im Browser. Claude darf keine Konten anlegen und keine Zugangsdaten bei fremden Diensten eingeben.

> **Hinweis:** Die Menüs bei Supabase ändern sich öfter. Heißt ein Punkt bei dir etwas anders, such im linken Menü nach dem ähnlichsten Begriff oder nutz die Suche oben im Dashboard.

---

## Schritt 1: Projekt anlegen

1. Öffne https://supabase.com/dashboard und melde dich an (oder erstelle ein kostenloses Konto).
   **Merk dir, mit welcher E-Mail-Adresse du dich anmeldest.** Nur an diese Adresse schickt Supabase in der Testphase Login-Codes (siehe „Wichtig zum Testen“ unten).
2. Klick auf **New project**.
3. Ausfüllen:
   - **Name:** `dopamin-menu`
   - **Database Password:** auf **Generate a password** klicken und im Passwort-Manager speichern. Die App braucht es nicht, aber du brauchst es eventuell später.
   - **Region:** **Central EU (Frankfurt)**. Das ist wichtig für den Datenschutz, die Daten bleiben in der EU.
   - **Plan:** Free
4. **Create new project** und 1–2 Minuten warten, bis das Projekt bereit ist.

✅ *Fertig, wenn du das Projekt-Dashboard siehst.*

---

## Schritt 2: Login per E-Mail einschalten und Code auf 5 Minuten stellen

1. Links **Authentication** → **Sign In / Providers**
2. Klick auf **Email**:
   - **Enable Email provider:** an
   - **Confirm email:** an
   - **Email OTP Expiration:** `300` (Sekunden = 5 Minuten)
   - **Email OTP Length:** `6` (falls angezeigt)
3. **Save**

✅ *Fertig, wenn Email als aktiv angezeigt wird.*

---

## Schritt 3: E-Mail-Vorlagen auf Deutsch, mit Code statt Link

1. Links **Authentication** → **Emails** → Reiter **Templates**
2. Öffne die Vorlage **Confirm signup** und ersetze:
   - **Subject:**
     ```
     Dein Code für das Dopamin-Menü
     ```
   - **Body / Message:**
     ```html
     <h2>Hallo!</h2>
     <p>Dein Anmelde-Code für das Dopamin-Menü:</p>
     <p style="font-size:28px;font-weight:bold;letter-spacing:4px">{{ .Token }}</p>
     <p>Der Code gilt 5 Minuten. Wenn du dich nicht anmelden wolltest, kannst du diese E-Mail einfach ignorieren.</p>
     ```
   - **Save**
3. Dasselbe bei der Vorlage **Magic Link** (gleicher Betreff, gleicher Text), **Save**.

**Wichtig:** `{{ .Token }}` muss genau so drinstehen, mit den doppelten geschweiften Klammern. Daraus macht Supabase den 6-stelligen Code. Ein Link wird nicht gebraucht.

✅ *Fertig, wenn beide Vorlagen gespeichert sind.*

---

## Schritt 4: Adresse der App eintragen

1. Links **Authentication** → **URL Configuration**
2. **Site URL:** `https://dopamin-menu.vercel.app`
3. Unter **Redirect URLs** → **Add URL**, nacheinander:
   - `http://localhost:5180`
   - `https://*-vuanh93-6278s-projects.vercel.app`
4. **Save**

*(Für den Login per Code braucht man das eigentlich nicht. Es verhindert aber Fehler, falls Supabase doch einmal auf die App zurückleitet.)*

---

## Schritt 5: Projekt-Adresse und Schlüssel kopieren

1. Links unten **Project Settings** (Zahnrad) → **API Keys**.
   *Alternativ:* oben im Dashboard auf **Connect** klicken. Dort stehen Adresse und Schlüssel fertig zum Kopieren.
2. Du brauchst genau zwei Werte:
   - **Project URL**, sieht aus wie `https://abcdefghijkl.supabase.co`
   - **Publishable key**, beginnt mit `sb_publishable_…`

**⚠️ Nicht verwenden:** den **Secret key** (`sb_secret_…`) und den alten **service_role**-Schlüssel. Die haben Vollzugriff auf alle Daten und dürfen nie in die App, in eine Datei im Projekt oder in den Chat.
Der Publishable key darf im Browser stehen, dafür ist er gemacht. Die Daten schützen wir später mit Zugriffsregeln in der Datenbank.

---

## Schritt 6a: Werte lokal eintragen (für die Entwicklung)

1. In VS Code im Projektordner `Dopamin Menu` (ganz oben, nicht in `src`) eine **neue Datei** anlegen: Rechtsklick in die Dateiliste → **New File** → Name: **`.env.local`** (mit Punkt am Anfang).
2. Diesen Inhalt hineinkopieren und die Platzhalter durch deine zwei Werte ersetzen:
   ```
   VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```
   Ohne Anführungszeichen, ohne Leerzeichen um das `=`.
3. Speichern.

Diese Datei wird **nicht** zu GitHub hochgeladen (`*.local` steht in der `.gitignore`).

## Schritt 6b: Werte in Vercel eintragen (für Vorschau und Live-Seite)

1. https://vercel.com → Projekt **dopamin-menu** → **Settings** → **Environment Variables**
2. Zwei Variablen anlegen, jeweils mit den Umgebungen **Production** und **Preview**:
   - Key `VITE_SUPABASE_URL`, Value: deine Project URL
   - Key `VITE_SUPABASE_PUBLISHABLE_KEY`, Value: dein Publishable key
3. **Save**

*(Wirksam werden sie beim nächsten Deployment. Das passiert automatisch beim nächsten Push.)*

---

## Wichtig zum Testen

- **Login-Codes kommen in der Testphase nur bei Mitgliedern deines Supabase-Teams an**, also an die E-Mail-Adresse, mit der du dich bei Supabase angemeldet hast. Andere Adressen bekommen die Fehlermeldung „Email address not authorized“. Weitere Tester lädst du unter **Organization → Team** ein.
- **Höchstens 2 Mails pro Stunde** über den eingebauten Versand. Also sparsam testen. Der Code ist 5 Minuten gültig, man muss nicht für jeden Versuch einen neuen anfordern.
- Vor dem Livegang richten wir einen eigenen E-Mail-Dienst ein (eigener Schritt, kommt später). Dann gelten diese Grenzen nicht mehr.

---

## Checkliste – sag Claude Bescheid, wenn alles erledigt ist

- [ ] Projekt in **Frankfurt** angelegt
- [ ] Email-Login an, **Confirm email** an, Code **300 Sekunden**, **6 Stellen**
- [ ] Vorlagen **Confirm signup** und **Magic Link** auf Deutsch mit `{{ .Token }}`
- [ ] Site URL und Redirect URLs eingetragen
- [ ] `.env.local` mit `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` angelegt
- [ ] Beide Variablen in Vercel (Production + Preview)

Claude prüft danach nur, *ob* die Datei und die zwei Variablen vorhanden sind, und liest oder zeigt die Werte nicht an.
