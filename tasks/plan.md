# Umsetzungsplan: Dopamin-Menü v6 (Reparatur, Footer, Home, Breaker)

*Stand: 05.10.2026 · Aufgaben im Detail: `tasks/todo.md`*

## Überblick

Vier Dinge in dieser Reihenfolge:

1. **Reparatur:** `src/App.jsx` lässt sich seit dem Onboarding-Commit vom 29.08. nicht mehr bauen. Live läuft noch der Stand vom 27.08. (`3a43042`), also ohne Onboarding.
2. **Footer-Navigation** mit 5 Tabs.
3. **Home-Dashboard** als neue Startseite.
4. **Breaker** nach dem Meilenstein-Konzept (`docs/ideas/breaker-meilensteine.md`, CLAUDE.md Abschnitt 3).

## Ausgangslage (geprüft)

- **GitHub** (`dutsch93/dopamin-menu`) und die lokale Datei sind identisch. Beide sind kaputt, und alle 4 Commits vom 29.08. scheitern beim Build.
- **Ursache:** Beim Onboarding-Commit wurde der Code mit festen Zeilenumbrüchen eingefügt, vermutlich aus einem Terminal kopiert. Das hat 92 Umbrüche mitten in Wörtern und Texten erzeugt und zusätzliche Leerzeichen hinter manchen Emojis.
- **Die echten Änderungen** des Onboarding-Commits sind überschaubar: 12 Einfügungen (Onboarding-Daten, Zustand, `finishOnboarding`, Sortierung, Overlay, Styles). Dazu kommt ein versehentlich gelöschter Text (`& atmen 💧`).
- Der lokale Ordner ist **kein Git-Repository**, und eine `.gitignore` fehlt lokal.
- Es gibt **keine Tests**. Entscheidung: keine neue Dependency. Geprüft wird mit Build, Lint, Klicktests im Browser und Prüfskripten im Scratchpad.

## Architektur-Entscheidungen

- **Reparatur auf Basis des sauberen Stands `3a43042`:** Die 12 Onboarding-Änderungen werden sauber neu eingesetzt. Das ist sicherer, als die 92 Umbrüche einzeln zusammenzuflicken, denn so kommen auch die versteckten Emoji-Leerzeichen nicht mit. Prüfung: Der Inhaltsvergleich ohne Leerraum zeigt nur die Onboarding-Änderungen.
- **Icons über Google Fonts statt npm-Paket:** Die Material Symbols Rounded (gefüllt) werden wie Fredoka per `@import` geladen. Das ist keine neue Dependency, und es kommt kein neuer Drittanbieter dazu. Über `icon_names` lädt Google nur die verwendeten Icons. `display=block` verhindert, dass beim Laden kurz Wörter wie „home“ statt der Icons zu sehen sind.
- **Alles bleibt in `src/App.jsx`**, wie in der CLAUDE.md festgelegt. Die Datei wächst dadurch auf schätzungsweise 900–1000 Zeilen. Das ist in Ordnung, solange jeder neue Bereich einen deutschen Kommentar-Kopf bekommt (`/* ═══ BREAKER ═══ */`).
- **Terminplanung als reine Funktion** (`planDue(steps, deadline, today)`) oberhalb der Komponente. So lässt sie sich mit einem Skript prüfen, ohne Test-Framework.
- **Datumsangaben als lokales `YYYY-MM-DD`** über eine eigene Hilfsfunktion, nicht über `toISOString()`. Die rechnet in UTC, und dann wäre ein Schritt nachts um 1 Uhr schon „gestern“ fällig.
- **Alte Speicherstände bleiben gültig:** `tasks` startet mit `st?.tasks || []`. Ein neuer localStorage-Key ist nicht nötig.
- **Branch statt direkt `main`:** Gearbeitet wird auf `feature/v6`. Vercel baut daraus eine Vorschau-URL. `main` (also live) bekommt nur geprüfte Stände, und jeder Push nach `main` erst nach deinem OK.
- **Keine Code-Eingabe über Bash-Heredocs oder Copy-Paste aus dem Terminal**, nur über die Datei-Werkzeuge. Genau so ist der aktuelle Schaden entstanden.

## Aufgabenliste

### Phase 0: Fundament
- [x] Task 0: Git lokal einrichten und mit GitHub verbinden
- [x] Task 1: App.jsx reparieren (Onboarding sauber auf `3a43042` übertragen)

### Checkpoint 0: Reparatur
- [x] Build und Lint grün, Onboarding und alle 3 alten Tabs funktionieren im Browser
- [x] **Deine Entscheidung:** Reparatur sofort live stellen → am 05.10. live gestellt

### Phase 1: Navigation und Home
- [x] Task 2: Footer-Navigation mit 5 Tabs (Home und Breaker vorerst als Platzhalter), Icon-Grundlage, Header ohne „Jellycat Edition“
- [x] Task 2b: Emojis überall durch bunte Material Symbols ersetzen (Wunsch vom 05.10.)
- [x] Task 3: Home Teil 1: Motivation, Batterie-Übersicht, „Ich brauch was!“
- [x] Task 4: Home Teil 2: „Heute dran“ (Habits), Tipp des Tages

### Checkpoint 1: Navigation und Home
- [x] Alle 5 Tabs erreichbar, Home zeigt echte Daten, Handy und Tablet sehen gut aus
- [x] Gemeinsamer Blick auf die Vercel-Vorschau

### Phase 2: Breaker-Kern
- [x] Task 5: Terminplanung als Funktion und Prüfskript
- [x] Task 6: Rauskippen: Schnelleingabe und Meilenstein-Liste
- [x] Task 7: Fragebogen Pflichtteil: Kategorie und Schritte mit Terminen
- [x] Task 8: Schritt-Ansicht: abhaken, bearbeiten, verschieben, Abschluss-Feier

### Checkpoint 2: Kernablauf
- [x] Rauskippen → Zerlegen → Abhaken → Feier funktioniert durchgehend und überlebt ein Neuladen der Seite

### Phase 3: Breaker-Feinschliff
- [x] Task 9: Optionale Fragen: Warum, erster Schritt, Frist-Typ, Belohnung
- [x] Task 10: Fällige Schritte auf Home („Dein Fokus“, vorher „Heute dran“)
- [ ] Task 11: Sanfte Hinweise: Frist vorbei, „Steckst du fest?“, „X warten aufs Zerlegen“

### Checkpoint 3: Fertig
- [ ] Alle Akzeptanzkriterien erfüllt, CLAUDE.md auf Stand v6 (inkl. Onboarding)
- [ ] Merge nach `main` nach deinem OK

## Risiken und Gegenmaßnahmen

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Bei der Reparatur geht unbemerkt Inhalt verloren | Hoch | Inhaltsvergleich ohne Leerraum gegen beide Versionen. Erlaubt sind nur die 12 Onboarding-Änderungen. Den gelöschten Text `& atmen 💧` bewusst prüfen. |
| Datums- und Zeitzonenfehler bei Fälligkeiten | Mittel | Lokale Datums-Hilfsfunktion. Das Prüfskript testet auch Monatswechsel und Frist = heute. |
| `backdrop-filter` funktioniert in manchen Browsern nicht | Niedrig | Der Hintergrund ist zu 75 % deckend, deshalb bleibt der Footer auch ohne Unschärfe lesbar. |
| Das Datumsfeld sieht auf iOS anders aus | Niedrig | Natives `<input type="date">` akzeptieren und auf dem Handy prüfen. |
| `App.jsx` wird unübersichtlich | Mittel | Kommentar-Köpfe pro Bereich, Hilfsfunktionen oberhalb der Komponente. Eine Aufteilung in mehrere Dateien nur nach Rückfrage. |
| Datei wird erneut beim Kopieren beschädigt | Hoch | Nur Datei-Werkzeuge verwenden, nach jedem Task Build und Lint. |

## Entscheidungen zu Phase 2 (05.10., Checkpoint 1)

1. **Erledigte Schritte zählen für Streak und „Heute“** (nicht nur für Sterne).
2. **Löschen:** × bei ungeplanten Einträgen in der Liste, „Meilenstein löschen“ in der Schritt-Ansicht, jeweils mit Rückfrage in der App. Zusätzlich gibt es „Loslassen“ bei überschrittener Frist.
3. **Name und Frist sind in der Schritt-Ansicht änderbar.** Bei neuer Frist werden die offenen Schritte neu verteilt, von Hand verschobene bleiben.
