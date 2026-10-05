# Anleitung: Supabase für das Dopamin-Menü einrichten

*Für Anh · gehört zu Task 0 in `tasks/todo.md` · Dauer: ca. 15 Minuten*

Supabase speichert ab v7 die Konten (und ab Modul `cloud-sync` die App-Daten). Diese Schritte machst du selbst im Browser. Claude darf keine Konten anlegen und keine Zugangsdaten bei fremden Diensten eingeben.

## 1. Projekt anlegen

1. Auf https://supabase.com anmelden (oder kostenloses Konto erstellen).
2. **New project**
   - Name: `dopamin-menu`
   - Database Password: ein starkes Passwort erzeugen lassen und im Passwort-Manager speichern. Wir brauchen es für die App nicht.
   - **Region: Central EU (Frankfurt)**. Wichtig für den Datenschutz.
   - Plan: Free
3. Warten, bis das Projekt bereit ist (1–2 Minuten).

## 2. Login per E-Mail einstellen

1. Links **Authentication** → **Sign In / Providers** (je nach Version „Providers“) → **Email**
   - „Enable Email provider“: **an**
   - „Confirm email“: **an**
   - Speichern
2. **Authentication** → Bereich mit den E-Mail-/OTP-Einstellungen (je nach Version unter „Providers → Email“ oder „Settings“):
   - **Email OTP Expiration:** `300` (Sekunden = 5 Minuten)
   - **Email OTP Length:** `6`, falls die Einstellung angezeigt wird
   - Speichern

## 3. E-Mail-Vorlagen auf Deutsch, mit Code statt Link

**Authentication** → **Emails** (bzw. „Email Templates“). Ersetze bei **„Confirm signup“** und bei **„Magic Link“** jeweils Betreff und Inhalt:

**Betreff:**
```
Dein Code für das Dopamin-Menü
```

**Inhalt (Message body):**
```html
<h2>Hallo!</h2>
<p>Dein Anmelde-Code für das Dopamin-Menü:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:4px">{{ .Token }}</p>
<p>Der Code gilt 5 Minuten. Wenn du dich nicht anmelden wolltest, kannst du diese E-Mail einfach ignorieren.</p>
```

Wichtig: `{{ .Token }}` muss genau so drinstehen. Daraus macht Supabase den 6-stelligen Code. Einen Link (`{{ .ConfirmationURL }}`) brauchen wir nicht.

## 4. Adresse der App eintragen

**Authentication** → **URL Configuration**
- **Site URL:** `https://dopamin-menu.vercel.app`
- **Redirect URLs:** `http://localhost:5180` und `https://*-vuanh93-6278s-projects.vercel.app` hinzufügen

## 5. Zugangsdaten an die App geben

**Project Settings** → **API** (bzw. „Data API“ / „API Keys“). Du brauchst zwei Werte:
- **Project URL**, z.B. `https://abcd1234.supabase.co`
- **anon public** Key (langer Text, beginnt meist mit `eyJ…`; in neueren Versionen „publishable key“, beginnt mit `sb_publishable_…`)

**Nicht** den Schlüssel „service_role“ bzw. „secret“ verwenden. Der darf nie in die App.

**a) Lokal:** Im Projektordner eine Datei `.env.local` anlegen (Claude legt dir eine Vorlage `.env.example` an, die du kopieren kannst):
```
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```
Diese Datei wird nicht auf GitHub hochgeladen (`*.local` steht in der `.gitignore`).

**b) Vercel:** Projekt `dopamin-menu` → **Settings** → **Environment Variables**. Beide Variablen mit denselben Namen und Werten anlegen, Umgebungen **Preview** und **Production** anhaken.

## 6. Bescheid sagen

Sag Claude, wenn du fertig bist. Claude prüft nur, *ob* die Variablen gesetzt sind, und gibt die Werte nicht aus.

## Gut zu wissen

- Der eingebaute E-Mail-Versand von Supabase schickt nur **sehr wenige Mails pro Stunde**. Zum Testen reicht das, wenn man sparsam ist. Vor dem Livegang richten wir einen eigenen E-Mail-Dienst ein.
- Der anon key darf im Browser stehen. Geschützt werden die Daten ab `cloud-sync` durch Zugriffsregeln in der Datenbank (Row Level Security).
