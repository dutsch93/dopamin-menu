# Aufgaben v7 – Modul `cloud-sync`

*Plan: `tasks/plan.md` · Spezifikation: `docs/specs/SPEC-cloud-sync.md`*
*Vor jedem Commit: `npm test`, `npm run build`, `npm run lint` (max. 6 Fehler / 2 Warnungen)*

## Task 0: Tabelle anlegen (Anh)
- [ ] Schritt 8 der Anleitung `docs/specs/supabase-einrichtung.md` ausgeführt
- [ ] Prüfabfrage zeigt: Row Level Security ist an, 3 Regeln vorhanden

## Task 1: Reine Sync-Logik (`logic.js`)
- [x] `hasRealData`: leere Standard-Daten zählen nicht als Daten
- [x] `dataSummary`: Meilensteine, Habits, Sterne für den Dialog
- [x] `syncDecision`: alle Fälle der Tabelle in der Spezifikation getestet
- [x] `packData` / `unpackData`: Paket hin und zurück ohne Verlust, kaputte Daten abgefangen
- Dateien: `src/logic.js`, `src/logic.test.js`

## Task 2: Start-Abgleich *(gebaut, Klicktest offen)*
- [x] Nach dem Login zeigt die Hülle den Lade-Oktopus, bis der Abgleich entschieden ist
- [x] Hochladen, Herunterladen, Frisch funktionieren; ohne Internet startet die App mit den Gerätedaten
- [x] `sync_meta` in `LOCAL_DATA_KEYS`
- Dateien: `src/App.jsx`, `src/logic.js`

## Task 3: Laufend sichern *(gebaut, Klicktest offen)*
- [x] Änderung → nach 2 s im Konto; App-Start ohne Änderung → kein Upload
- [x] Offline-Änderungen werden bei `online` / Rückkehr in den Tab / Neustart hochgeladen
- [x] Rückkehr in den Tab holt neueren Konto-Stand, wenn hier nichts Ungesichertes liegt
- Dateien: `src/App.jsx`

## ✅ Checkpoint C1
- [ ] Laptop → iPhone und zurück, Flugmodus-Test

## Task 4: Auswahl-Dialog *(gebaut, Klicktest offen)*
- [x] Beide Stände mit Kurzinfo, Rückfrage vor dem Verwerfen, Tastatur und Vorlesen
- Dateien: `src/App.jsx`

## Task 5: Sicherungs-Status *(gebaut, Klicktest offen)*
- [x] Konto-Panel: „Alles gesichert · vor X Min.“ / „Wird gesichert …“ / „Offline – …“
- [x] Header-Wolke nur bei ungesichert, mit `aria-label`; neues Icon in `ICON_NAMES`
- Dateien: `src/App.jsx`

## Task 6: Abmelden *(gebaut, Klicktest offen)*
- [x] Erst sichern; klappt das nicht → Rückfrage in der App
- [x] Danach alle Nutzerdaten (inkl. alter `…@<id>`-Reste und `data_owner`) aus dem Browser gelöscht
- Dateien: `src/App.jsx`, `src/logic.js`

## ✅ Checkpoint C2: Modul fertig
- [ ] Klicktest-Checkliste durch Anh, zwei Konten: gegenseitig keine Daten sichtbar
- [ ] CLAUDE.md aktualisiert, Push `feature/v7`. **Kein** Merge nach `main`
