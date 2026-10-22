# Spec: cloud-sync – App-Daten im Konto sichern

*Modul 2 von 3, siehe `v7-capability-map.md`. Baut auf `identity` auf. Status: **freigegeben** am 22.10.2026*

## Ziel

Die App-Daten (Menü, Sterne, Streak, Habits, Batterien, Meilensteine, eigene Tipps, Onboarding-Profil) liegen nicht mehr nur im Browser, sondern **im Konto in Supabase (Frankfurt)**. Dadurch:

- gehen sie nicht verloren, wenn der Browser-Speicher gelöscht wird oder das Handy kaputtgeht,
- sind sie auf **jedem Gerät** da, auf dem man sich anmeldet,
- funktioniert die App **offline** weiter wie bisher.

**Für wen:** Menschen mit ADHS. Das Sichern muss **unsichtbar und zuverlässig** sein: kein Speichern-Button, keine Fachbegriffe, keine Meldungen, solange alles gut läuft.

## Entscheidungen (21.10.2026, Anh)

1. **Konflikt beim ersten Login:** Haben Gerät *und* Konto Daten, zeigt die App beide Stände mit Kurzinfo, und man wählt einen. Der andere wird nach einer Rückfrage **verworfen**. Nichts wird zusammengeführt.
2. **Abmelden löscht die Daten auf dem Gerät.** Gibt es noch ungesicherte Änderungen, versucht die App erst zu sichern. Klappt das nicht (z.B. offline), fragt sie nach: „Noch nicht gesichert – trotzdem abmelden?“
3. **Anzeige ruhig, nur bei Problemen:** Im Konto-Panel steht immer der Stand („Gesichert vor 2 Min.“). Im Header erscheint nur dann ein kleines Wolken-Symbol, wenn etwas noch nicht gesichert werden konnte.
4. **Keine zusätzliche Verschlüsselung in v7.** Supabase verschlüsselt die Speicher, und Zugriffsregeln in der Datenbank sorgen dafür, dass jedes Konto nur seine eigenen Daten sieht. Der Betreiber könnte die Daten im Supabase-Dashboard sehen. Das muss in der Datenschutzerklärung stehen (Modul `account-privacy`).

Aus dem Bauplan übernommen: **Bearbeiten zwei Geräte gleichzeitig, gewinnt der zuletzt gespeicherte Stand.** Ein echtes Zusammenführen gibt es in v7 nicht.

## Ablauf (User Stories)

1. **Ich nutze die App wie immer.** Jede Änderung wird sofort im Browser gespeichert (wie bisher) und etwa 2 Sekunden später automatisch im Konto gesichert. Ich merke davon nichts.
2. **Ich schaue nach, ob alles gesichert ist.** Im Konto-Panel steht „Alles gesichert · vor 2 Min.“ bzw. „Wird gesichert …“.
3. **Ich bin offline.** Ich arbeite normal weiter. Im Header erscheint ein kleines Wolken-Symbol (durchgestrichen), im Konto-Panel steht „Offline – wird gesichert, sobald du wieder online bist“. Kommt das Internet zurück, sichert die App von selbst, und das Symbol verschwindet.
4. **Ich melde mich auf einem neuen Gerät an** (Handy, zweiter Browser). Nach dem Code sehe ich kurz den Lade-Oktopus, dann meine Daten. Kein Onboarding.
5. **Ich melde mich zum ersten Mal nach dem Update an, und nur das Gerät hat Daten** (der Normalfall für alle bisherigen Nutzer). Die Daten werden ohne Nachfrage ins Konto übernommen.
6. **Gerät und Konto haben beide Daten** (z.B. ich habe die App auf dem Handy und am Laptop unabhängig genutzt): Ich sehe eine Auswahl:
   > **Welche Daten möchtest du behalten?**
   > **Auf diesem Gerät:** 4 Meilensteine · 6 Habits · 87 Sterne
   > **In deinem Konto:** 2 Meilensteine · 3 Habits · 40 Sterne · zuletzt geändert am 18.10.
   Nach der Wahl: „Die anderen Daten werden gelöscht. Das kann man nicht rückgängig machen.“ → „Ja, behalten“ / „Zurück“.
7. **Ich wechsle zwischen Handy und Laptop.** Öffne ich die App oder wechsle in den Tab zurück, holt sie den neuesten Stand aus dem Konto.
8. **Ich melde mich ab.** Die App sichert noch ausstehende Änderungen und löscht dann die Daten auf diesem Gerät. Wer danach den Browser nutzt, findet nichts mehr von mir.

## Akzeptanzkriterien

- [ ] Jede Änderung ist spätestens ~2 Sekunden nach der letzten Eingabe im Konto gesichert (bei Internet)
- [ ] Offline gemachte Änderungen werden automatisch gesichert, sobald wieder Internet da ist (auch nach Neuladen der Seite)
- [ ] Neues Gerät: Daten erscheinen nach dem Login, Onboarding wird **nicht** erneut gezeigt
- [ ] Erster Login mit Gerätedaten und leerem Konto: Übernahme ohne Rückfrage
- [ ] Gerät und Konto haben beide Daten: Auswahl mit Kurzinfo und Rückfrage. Leere Standard-Daten (nur mitgelieferte Menü-Einträge, keine Sterne, keine Habits, keine Meilensteine) zählen **nicht** als „Daten“, dafür wird nicht gefragt
- [ ] Zurück in die App (Tab-Wechsel, App aus dem Hintergrund): neuerer Stand aus dem Konto wird übernommen, wenn hier nichts Ungesichertes liegt
- [ ] Abmelden: ausstehende Änderungen werden vorher gesichert. Geht das nicht, Rückfrage in der App (kein `window.confirm`). Danach liegen **keine** Nutzerdaten dieses Kontos mehr im Browser
- [ ] Konto-Panel zeigt den Sicherungsstand. Header-Wolke nur bei „nicht gesichert“ (offline oder Fehler), mit `aria-label`
- [ ] Ein Konto kann über die Datenbank-Regeln **nur seine eigene Zeile** lesen und schreiben (geprüft mit zwei Test-Konten)
- [ ] Kaputte oder fremde Daten aus der Cloud bringen die App nicht zum Absturz (gleiche Prüfung wie beim Laden aus dem Browser, `cleanTasks` usw.)
- [ ] Keine App-Daten, E-Mail-Adressen oder Schlüssel in der Browser-Konsole
- [ ] Barrierefreiheit: Auswahl-Dialog mit Tastatur bedienbar, Fokus im Dialog, Statusänderungen werden vorgelesen (`aria-live`), Kontraste mind. 4,5:1
- [ ] Keine neue Dependency (nur `@supabase/supabase-js`, schon vorhanden)

## Datenbank (richtet Anh ein, mit Anleitung und fertigem SQL)

Eine Tabelle, **eine Zeile pro Konto**. Die App-Daten liegen darin als ein Paket (JSON), genau so wie heute im Browser. Das ist einfach, und die Daten sind klein (meist unter 50 KB).

```sql
create table public.app_data (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data       jsonb not null,                      -- alles aus dopamin_menu_v5 + onboardingComplete
  schema     int not null default 5,              -- Format-Version, für spätere Umbauten
  updated_at timestamptz not null default now(),
  constraint data_size check (pg_column_size(data) < 1000000)  -- max. ca. 1 MB pro Konto
);

alter table public.app_data enable row level security;

-- Jedes Konto sieht und ändert nur seine eigene Zeile
create policy "eigene Daten lesen"   on public.app_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "eigene Daten anlegen" on public.app_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "eigene Daten ändern"  on public.app_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Kein Löschen aus der App heraus. Konto löschen kommt in account-privacy (löscht die Zeile über "on delete cascade" mit).

-- Zeitstempel setzt immer die Datenbank (nicht die Uhr des Geräts)
create function public.app_data_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end; $$;
create trigger app_data_touch before insert or update on public.app_data
  for each row execute function public.app_data_touch();
```

- `updated_at` setzt die **Datenbank** (Trigger), nicht das Gerät. Dadurch ist die Uhrzeit auf allen Geräten vergleichbar.
- Ohne die Zugriffsregeln (Row Level Security) könnte jedes Konto alle Daten lesen. Deshalb prüfen wir das ausdrücklich mit zwei Test-Konten.

## Wie der Abgleich funktioniert

**Im Browser** liegen zusätzlich zu den App-Daten Sync-Infos (Schlüssel `sync_meta`, gehört zu `LOCAL_DATA_KEYS`):
`{ dirty: true/false, changedAt: "…", syncedAt: "…" }`. `dirty` = es gibt Änderungen, die noch nicht im Konto sind. `syncedAt` = `updated_at` des Konto-Stands, auf dem das Gerät zuletzt war.

**Beim Start (nach dem Login, bevor die App erscheint)** holt die App die Zeile aus dem Konto und entscheidet:

| Gerät | Konto | Was passiert |
|---|---|---|
| leer | leer | Onboarding wie bisher, danach hochladen |
| hat Daten, nie mit diesem Konto abgeglichen | leer | Gerätedaten hochladen (Story 5) |
| leer | hat Daten | Konto-Daten aufs Gerät (Story 4) |
| hat Daten, nie mit diesem Konto abgeglichen | hat Daten | **Auswahl-Dialog** (Story 6) |
| schon abgeglichen, nichts Ungesichertes | neuer | Konto-Daten übernehmen |
| schon abgeglichen, Ungesichertes da | unverändert seit `syncedAt` | Gerätedaten hochladen |
| schon abgeglichen, Ungesichertes da | auch geändert | der **neuere** Stand gewinnt (Vergleich `changedAt` mit `updated_at`) |

Diese Entscheidung ist eine **reine Funktion** in `logic.js` (`syncDecision`) und wird mit allen Fällen der Tabelle getestet.

**Während der Nutzung:** Die bestehende Speicher-Funktion `sv()` schreibt weiter in den Browser und setzt zusätzlich `dirty`. 2 Sekunden nach der letzten Änderung wird hochgeladen (`upsert`). Klappt es nicht, wird es beim nächsten `online`-Ereignis, beim Zurückkehren in den Tab und beim nächsten Start erneut versucht.

**Zurück in die App** (`visibilitychange`): Ist nichts ungesichert und das Konto neuer, werden die Konto-Daten übernommen, und die App baut sich neu auf (wie beim Kontowechsel über `key`). Ist etwas ungesichert, wird erst hochgeladen.

## Tech-Stack

- Unverändert: React 19, Vite 8, `@supabase/supabase-js` v2, Vitest
- Lesen: `supabase.from("app_data").select("data,updated_at").maybeSingle()`
- Schreiben: `supabase.from("app_data").upsert({ user_id, data }).select("updated_at").single()`
- Keine Echtzeit-Verbindung (Realtime). Abgleich beim Start und beim Zurückkehren reicht und spart Akku.

## Projektstruktur

```
src/logic.js       ← NEU: syncDecision, hasRealData, dataSummary (Kurzinfo für den Dialog), Paket packen/entpacken
src/logic.test.js  ← Tests für alle Fälle der Tabelle oben
src/App.jsx        ← Laden/Sichern mit Supabase in der Hülle App, Auswahl-Dialog, Status im Konto-Panel, Header-Wolke, Abmelden mit Löschen
docs/specs/supabase-einrichtung.md ← NEU: Schritt 8 „Tabelle anlegen“ mit dem SQL oben
```

`DopaminMenu` bleibt weitgehend unverändert: Es liest und schreibt weiter den Browser-Speicher. Die Hülle sorgt dafür, dass dort vor dem Start der richtige Stand liegt.

## Code-Stil

Wie bisher. Beispiel:

```js
// Was tun beim Start? Rein rechnerisch, ohne Supabase – deshalb testbar.
export function syncDecision(local,meta,remote){
  if(!remote) return hasRealData(local)?"upload":"fresh";
  if(!hasRealData(local)) return "download";
  if(!meta?.syncedAt) return "ask";                 // Gerät und Konto unabhängig voneinander befüllt
  if(!meta.dirty) return remote.updated_at>meta.syncedAt?"download":"same";
  if(remote.updated_at===meta.syncedAt) return "upload";
  return meta.changedAt>remote.updated_at?"upload":"download"; // beide geändert: der neuere gewinnt
}
```

## Teststrategie

| Was | Wie |
|---|---|
| `syncDecision` (alle Tabellenfälle), `hasRealData`, `dataSummary`, Paket packen/entpacken | **Vitest**, automatisch |
| Zugriffsregeln: Konto B kann Zeile von Konto A weder lesen noch ändern | Klicktest durch Anh mit zwei E-Mail-Adressen + SQL-Prüfabfrage aus der Anleitung |
| Zwei Geräte, offline, Konflikt-Dialog, Abmelden | Klicktest-Checkliste durch Anh (Laptop + iPhone, Flugmodus) |
| Build, Lint, Tests | vor jedem Commit (Lint: nicht mehr als 6/2) |

## Grenzen

- **Immer:** Browser bleibt die erste Speicherstelle (die App muss ohne Internet voll funktionieren). Daten aus der Cloud genauso prüfen wie aus dem Browser. Freundliche deutsche Texte.
- **Erst fragen:** Änderungen am Tabellenaufbau nach der Einrichtung, Realtime, weitere Tabellen, Push nach `main`.
- **Niemals:** den Secret key benutzen. Daten oder E-Mail-Adressen in die Konsole schreiben. Die Zugriffsregeln abschalten, „damit es geht“. Live gehen vor Modul `account-privacy`.

## Erfolgskriterien

1. Daten, die auf dem Laptop angelegt wurden, sind nach dem Login auf dem iPhone da, und umgekehrt.
2. Im Flugmodus gemachte Änderungen sind nach dem Wiederverbinden im Konto (sichtbar auf dem anderen Gerät).
3. Ein bisheriger Nutzer verliert beim ersten Login nach dem Update nichts.
4. Nach dem Abmelden ist im Browser nichts mehr von den Daten zu finden.
5. Ein zweites Konto sieht die Daten des ersten weder in der App noch über die Datenbank.
6. Tests, Build und Lint grün.

## Bekannte Grenzen und Risiken

- **Gleichzeitiges Bearbeiten auf zwei Geräten:** Der zuletzt gespeicherte Stand gewinnt, Änderungen des anderen Geräts gehen dann verloren. Für eine Person mit wenigen Geräten selten, bewusst hingenommen (Bauplan).
- **Supabase pausiert kostenlose Projekte** nach ca. 7 Tagen ohne Nutzung (passiert am 21.10.2026). Dann klappen weder Login noch Sichern. **Vor dem Livegang lösen** (Pro-Plan oder regelmäßiger Aufruf).
- **Gesundheitsdaten (DSGVO Art. 9):** Habits und Meilensteine können Gesundheitsbezug haben. Einwilligung und Datenschutzerklärung folgen in `account-privacy`. Bis dahin kein Livegang.
- **Altlast aus Modul 1:** Die beiseitegelegten Daten anderer Konten (`…@<user-id>`) werden mit dem Löschen beim Abmelden überflüssig. Vorhandene Reste räumt die App beim nächsten Abmelden mit auf.

## Offene Fragen

- Keine. Bitte die Spezifikation prüfen und freigeben.
