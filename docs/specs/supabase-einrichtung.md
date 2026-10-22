# Anleitung: Supabase für das Dopamin-Menü einrichten

*Für Anh · Task 0 in `tasks/todo.md` · Dauer: ca. 30–40 Minuten · Stand: 08.10.2026*

Supabase verwaltet ab v7 die Konten (Login per E-Mail-Code) und später die App-Daten. Diese Schritte machst du selbst im Browser. Claude darf keine Konten anlegen und keine Zugangsdaten bei fremden Diensten eingeben.

> **Hinweis:** Die Menüs bei Supabase ändern sich öfter. Heißt ein Punkt bei dir etwas anders, such im linken Menü nach dem ähnlichsten Begriff oder nutz die Suche oben im Dashboard.

---

## Schritt 1: Projekt anlegen

1. Öffne https://supabase.com/dashboard und melde dich an (oder erstelle ein kostenloses Konto).
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

## Schritt 3: Eigenen E-Mail-Versand mit Brevo einrichten

Supabase lässt die E-Mail-Vorlagen (Schritt 4) nur bearbeiten, wenn ein eigener E-Mail-Versand („Custom SMTP“) eingerichtet ist. Ohne eigene Vorlage enthält die Mail nur einen Link und keinen Code. Wir nehmen **Brevo**: EU-Anbieter, kostenlos bis 300 Mails pro Tag.

### 3a) Brevo-Konto und Absender

1. Kostenloses Konto auf https://www.brevo.com anlegen (Plan „Free“).
2. In Brevo eine **Absender-Adresse** bestätigen: oben rechts auf deinen Namen → **Senders, Domains & Dedicated IPs** → **Senders** → **Add sender**.
   - Name: `Dopamin-Menü`
   - E-Mail: eine Adresse, die du abrufen kannst
   - Brevo schickt dir eine Bestätigungsmail. Den Link darin anklicken.

> **Ohne eigene Domain (Testphase):** Kommen die Mails von einer Gmail-, iCloud- oder GMX-Adresse über Brevo, landen sie häufig im **Spam**. Zum Testen ist das okay, schau einfach im Spam-Ordner nach. **Vor dem Livegang** brauchen wir eine eigene Domain (ca. 5–15 € im Jahr), die wir in Brevo bestätigen. Dafür gibt es dann eine eigene kurze Anleitung.

### 3b) SMTP-Zugangsdaten bei Brevo holen

1. In Brevo: oben rechts auf deinen Namen → **SMTP & API** → Reiter **SMTP**.
2. Dort stehen **SMTP Server** (`smtp-relay.brevo.com`), **Port** (`587`) und dein **Login** (sieht aus wie `xxxxxx@smtp-brevo.com`).
3. **Generate a new SMTP key** → Name z.B. `supabase-dopamin-menu` → Schlüssel **sofort kopieren**. Er wird nur einmal angezeigt.
   **Nicht dein Brevo-Passwort verwenden**, das funktioniert nicht. Und nicht den „API key“, sondern den **SMTP key**.

### 3c) In Supabase eintragen

1. Supabase → **Authentication** → **Emails** → Reiter **SMTP Settings** → **Enable custom SMTP** einschalten.
2. Ausfüllen:
   - **Sender email:** die in Brevo bestätigte Absender-Adresse
   - **Sender name:** `Dopamin-Menü`
   - **Host:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Username:** dein Brevo-**Login** (`…@smtp-brevo.com`)
   - **Password:** der **SMTP key** aus 3b
   - **Minimum interval between emails:** `60` (Sekunden, passt zu „Code erneut senden“ in der App)
3. **Save**

**Den SMTP key nur dort eintragen.** Nicht in den Chat, nicht in `.env.local`, nicht ins Projekt. Die App braucht ihn nicht, nur Supabase.

✅ *Fertig, wenn „Custom SMTP“ als aktiv angezeigt wird. Ab jetzt sind die Vorlagen bearbeitbar, und das Limit steigt von 2 auf 30 Mails pro Stunde.*

---

## Schritt 4: E-Mail-Vorlagen auf Deutsch, mit Code statt Link

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

## Schritt 5: Adresse der App eintragen

1. Links **Authentication** → **URL Configuration**
2. **Site URL:** `https://dopamin-menu.vercel.app`
3. Unter **Redirect URLs** → **Add URL**, nacheinander:
   - `http://localhost:5180`
   - `https://*-vuanh93-6278s-projects.vercel.app`
4. **Save**

*(Für den Login per Code braucht man das eigentlich nicht. Es verhindert aber Fehler, falls Supabase doch einmal auf die App zurückleitet.)*

---

## Schritt 6: Projekt-Adresse und Schlüssel kopieren

1. Links unten **Project Settings** (Zahnrad) → **API Keys**.
   *Alternativ:* oben im Dashboard auf **Connect** klicken. Dort stehen Adresse und Schlüssel fertig zum Kopieren.
2. Du brauchst genau zwei Werte:
   - **Project URL**, sieht aus wie `https://abcdefghijkl.supabase.co`. Sie steht **nicht** unter „API Keys“, sondern unter **Project Settings → Data API** (oder im **Connect**-Dialog). Notfalls ableiten: Die Buchstabenfolge in der Browser-Adresse `…/dashboard/project/abcdefghijkl` ergibt `https://abcdefghijkl.supabase.co`.
   - **Publishable key**, beginnt mit `sb_publishable_…`

**⚠️ Nicht verwenden:** den **Secret key** (`sb_secret_…`) und den alten **service_role**-Schlüssel. Die haben Vollzugriff auf alle Daten und dürfen nie in die App, in eine Datei im Projekt oder in den Chat.
Der Publishable key darf im Browser stehen, dafür ist er gemacht. Die Daten schützen wir später mit Zugriffsregeln in der Datenbank.

---

## Schritt 7a: Werte lokal eintragen (für die Entwicklung)

1. In VS Code im Projektordner `Dopamin Menu` (ganz oben, nicht in `src`) eine **neue Datei** anlegen: Rechtsklick in die Dateiliste → **New File** → Name: **`.env.local`** (mit Punkt am Anfang).
2. Diesen Inhalt hineinkopieren und die Platzhalter durch deine zwei Werte ersetzen:
   ```
   VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```
   Ohne Anführungszeichen, ohne Leerzeichen um das `=`.
3. Speichern.

Diese Datei wird **nicht** zu GitHub hochgeladen (`*.local` steht in der `.gitignore`).

## Schritt 7b: Werte in Vercel eintragen (für Vorschau und Live-Seite)

1. https://vercel.com → Projekt **dopamin-menu** → **Settings** → **Environment Variables**
2. Zwei Variablen anlegen, jeweils mit den Umgebungen **Production** und **Preview**:
   - Key `VITE_SUPABASE_URL`, Value: deine Project URL
   - Key `VITE_SUPABASE_PUBLISHABLE_KEY`, Value: dein Publishable key
3. **Save**

*(Wirksam werden sie beim nächsten Deployment. Das passiert automatisch beim nächsten Push.)*

---

## Schritt 8: Tabelle für die App-Daten anlegen (Modul `cloud-sync`, ca. 5 Minuten)

Hier landen später die gesicherten App-Daten, eine Zeile pro Konto. Der Text unten legt die Tabelle an und schaltet die **Zugriffsregeln** ein. Sie sorgen dafür, dass jedes Konto nur seine eigenen Daten sieht.

1. Supabase → links **SQL Editor** → **New query** (bzw. „+“)
2. Den **gesamten** Text unten hineinkopieren und auf **Run** klicken:

```sql
-- Dopamin-Menü: gesicherte App-Daten, eine Zeile pro Konto
create table public.app_data (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data       jsonb not null,
  schema     int not null default 5,
  updated_at timestamptz not null default now(),
  constraint data_size check (pg_column_size(data) < 1000000)
);

alter table public.app_data enable row level security;

create policy "eigene Daten lesen"   on public.app_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "eigene Daten anlegen" on public.app_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "eigene Daten ändern"  on public.app_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create function public.app_data_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end; $$;
create trigger app_data_touch before insert or update on public.app_data
  for each row execute function public.app_data_touch();
```

   Erwartet: **„Success. No rows returned“**.

   Supabase zeigt eventuell eine Warnung („destructive operation“ o.ä.) und fragt nach. Das ist hier unbedenklich, bestätigen.

3. **Prüfen:** Inhalt des Editors löschen, diesen Text einfügen und **Run**:

```sql
select
  (select relrowsecurity from pg_class where oid = 'public.app_data'::regclass) as zugriffsregeln_an,
  (select count(*) from pg_policies where tablename = 'app_data') as anzahl_regeln;
```

   Erwartet: **`zugriffsregeln_an` = true** und **`anzahl_regeln` = 3**. Schick mir einfach diese zwei Werte.

**Nicht nötig:** Unter „Table Editor“ musst du nichts anklicken. „Realtime“ für die Tabelle bleibt aus.

✅ *Fertig, wenn die Prüfung true und 3 zeigt.*

> Steht da `relation "app_data" already exists`, wurde die Tabelle schon angelegt. Dann nur die Prüfung (Punkt 3) ausführen.

---

## Wichtig zum Testen

- **Mit Brevo (Schritt 3)** gehen Codes an jede Adresse, bis zu **30 Mails pro Stunde** (Supabase) bzw. **300 pro Tag** (Brevo, kostenlos).
- **Ohne eigene Domain** landen die Mails oft im **Spam-Ordner**. In der Testphase einfach dort nachsehen.
- Kommt gar keine Mail an: In Brevo unter **Transactional** → **Logs** nachsehen, ob die Mail verschickt wurde. Supabase zeigt Fehler unter **Logs** → **Auth**.
- **App meldet „Die E-Mail konnte gerade nicht verschickt werden“ (lokal: Status 500):** Supabase erreicht Brevo nicht. Brevo-Zugangsdaten **ohne Mailversand** prüfen mit `python3 tools/test-brevo-smtp.py` (fragt Login und SMTP key ab, speichert nichts):
  - **Code 535:** Login oder SMTP key falsch → neuen SMTP key erzeugen, Login genau so übernehmen, wie Brevo ihn anzeigt.
  - **Code 525 („Unauthorized IP address“):** In Brevo ist die **Sperre unbekannter IP-Adressen** aktiv. Supabase sendet von wechselnden Adressen, deshalb unter Brevo → **Security → Authorized IPs** die Sperre (für SMTP keys) **ausschalten**. *(So war es beim Einrichten am 11.10.2026.)*
- **Vor dem Livegang:** eigene Domain kaufen und in Brevo bestätigen (eigene Anleitung folgt).

---

## Checkliste – sag Claude Bescheid, wenn alles erledigt ist

- [ ] Projekt in **Frankfurt** angelegt
- [ ] Email-Login an, **Confirm email** an, Code **300 Sekunden**, **6 Stellen**
- [ ] Brevo: Konto, bestätigter Absender, **SMTP key** erzeugt
- [ ] Supabase: **Custom SMTP** mit Brevo-Daten aktiv
- [ ] Vorlagen **Confirm signup** und **Magic Link** auf Deutsch mit `{{ .Token }}`
- [ ] Site URL und Redirect URLs eingetragen
- [ ] `.env.local` mit `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` angelegt
- [ ] Beide Variablen in Vercel (Production + Preview)

Claude prüft danach nur, *ob* die Datei und die zwei Variablen vorhanden sind, und liest oder zeigt die Werte nicht an.
