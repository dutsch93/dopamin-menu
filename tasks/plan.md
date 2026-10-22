# Umsetzungsplan v7 – Modul `cloud-sync` (App-Daten im Konto sichern)

*Stand: 22.10.2026 · Spezifikation: `docs/specs/SPEC-cloud-sync.md` · Bauplan: `docs/specs/v7-capability-map.md` · Aufgaben: `tasks/todo.md`*
*Branch: `feature/v7`. Live erst, wenn alle drei v7-Module fertig sind. Vorheriges Modul: `tasks/archive/v7-identity-*.md`.*

## Überblick

Der Browser bleibt die erste Speicherstelle. Zusätzlich wird alles in einer Supabase-Tabelle `app_data` (eine Zeile pro Konto, JSON) gesichert. Beim Start entscheidet `syncDecision`, ob hoch- oder heruntergeladen oder nachgefragt wird. Während der Nutzung lädt die App 2 s nach jeder Änderung hoch. Beim Abmelden werden die Daten auf dem Gerät gelöscht.

## Abhängigkeiten

```
Task 0 (Anh: Tabelle anlegen) ───────────────┐
Task 1 (logic.js: Entscheidung, Kurzinfo) ───┼─ Task 2 (Start-Abgleich in der Hülle App)
                                             │        │
                                             │        ├─ Task 3 (Laufend sichern, offline, Rückkehr in den Tab)
                                             │        │        │
                                             │        │        └─ Task 5 (Status: Konto-Panel + Header-Wolke)
                                             │        ├─ Task 4 (Auswahl-Dialog bei Konflikt)
                                             │        └─ Task 6 (Abmelden: sichern, dann löschen)
```

## Architektur-Entscheidungen

- **Hülle `App` macht den Abgleich**, bevor `DopaminMenu` erscheint. `DopaminMenu` liest und schreibt weiter nur den Browser-Speicher. So bleibt die bestehende App fast unverändert.
- **Paket:** Inhalt von `dopamin_menu_v5` plus `onboardingComplete`. Packen und Entpacken sind reine Funktionen in `logic.js`.
- **Ungesichert-Markierung in `sv()`:** Nur wenn sich der gespeicherte Text wirklich ändert, wird `dirty` gesetzt. Sonst würde jeder App-Start (der Speicher-Effekt läuft beim Laden) einen Upload auslösen.
- **Sync-Steuerung als kleines Modul-Objekt in `App.jsx`** (außerhalb von React): Warteschlange mit 2-s-Verzögerung, Status-Abonnement für das Konto-Panel. Kein neuer Context, keine Dependency.
- **Neuaufbau nach Download:** Die Hülle erhöht einen Zähler im `key` von `DopaminMenu`, dann liest die App die neuen Daten.
- **Zeit:** `updated_at` kommt von der Datenbank. `changedAt` (Gerät) wird nur im seltenen Fall „beide geändert“ verglichen.

## Aufgaben

### Phase A: Fundament
- [ ] Task 0: Tabelle `app_data` mit Zugriffsregeln anlegen (**Anh**, Anleitung Schritt 8 in `docs/specs/supabase-einrichtung.md`)
- [ ] Task 1: `hasRealData`, `dataSummary`, `syncDecision`, `packData`/`unpackData` in `logic.js` mit Tests

### Phase B: Abgleich
- [ ] Task 2: Start-Abgleich in der Hülle `App` (hoch, runter, frisch)
- [ ] Task 3: Laufendes Sichern (2 s), offline nachholen, beim Zurückkehren neuen Stand holen

### Checkpoint C1
- [ ] Laptop und iPhone sehen dieselben Daten, offline gemachte Änderungen kommen an

### Phase C: Oberfläche
- [ ] Task 4: Auswahl-Dialog bei Konflikt
- [ ] Task 5: Status im Konto-Panel + Header-Wolke
- [ ] Task 6: Abmelden: sichern, dann Daten auf dem Gerät löschen

### Checkpoint C2: Modul `cloud-sync` fertig
- [ ] Klicktest-Checkliste (Anh), Zugriffsregeln mit zwei Konten geprüft
- [ ] CLAUDE.md aktualisiert, Push `feature/v7`, **kein** Merge nach `main`

## Risiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Zugriffsregeln fehlen oder sind falsch | Hoch (fremde Daten lesbar) | SQL fertig vorgegeben, Prüfabfrage in der Anleitung, Test mit zwei Konten |
| Endlosschleife Download → Speicher-Effekt → Upload | Mittel | `dirty` nur bei echter Änderung, Test dafür |
| Gleichzeitiges Bearbeiten auf zwei Geräten | Niedrig | Neuerer Stand gewinnt (bewusst, Bauplan) |
| Supabase-Pause (kostenloser Plan) | Hoch nach Livegang | vor Livegang lösen (siehe Spezifikation) |
| Datenverlust beim Abmelden offline | Mittel | Rückfrage, vorher Sicherungsversuch |
