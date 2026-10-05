# Aufgaben: Dopamin-Menü v6

*Übersicht und Begründungen: `tasks/plan.md`*

**Standard-Prüfung für jede Aufgabe** (zusätzlich zu den eigenen Kriterien):
- `npm run build` läuft ohne Fehler
- `npm run lint` ohne neue Fehler (Ausgangswert seit v1: 6 Fehler, 2 Warnungen in alten Code-Teilen, bewusst nicht angefasst)
- Klicktest im Browser (`npm run dev`), Handybreite (375 px) und Tablet (768 px)
- Alle neuen Texte auf Deutsch, Code-Kommentare auf Deutsch
- Nach Neuladen der Seite sind die Daten noch da (localStorage)

---

## Phase 0: Fundament

### Task 0: Git lokal einrichten und mit GitHub verbinden

**Beschreibung:** Den lokalen Ordner mit `github.com/dutsch93/dopamin-menu` verbinden, ohne lokale Dateien zu überschreiben. Die `.gitignore` aus dem Repo übernehmen. Einen Arbeits-Branch `feature/v6` anlegen.

**Akzeptanzkriterien:**
- [x] `git status` zeigt nur die neuen Dateien (CLAUDE.md, docs/, tasks/) als Änderungen; App.jsx gilt als unverändert
- [x] `node_modules`, `.DS_Store` und `.claude/settings.local.json` sind ignoriert (`.remember` ignoriert sich selbst)
- [x] Branch `feature/v6` ist aktiv

**Prüfung:**
- [x] `git status` und `git log` stimmen mit GitHub überein
- [x] Vorher Sicherungskopie des Ordners im Scratchpad

**Abhängigkeiten:** keine
**Dateien:** `.gitignore`
**Umfang:** XS

---

### Task 1: App.jsx reparieren

**Beschreibung:** Die Datei aus dem sauberen Stand `3a43042` nehmen und die 12 inhaltlichen Änderungen des Onboarding-Commits sauber wieder einsetzen: Onboarding-Daten, Zustand, Speichern, `finishOnboarding`, Sortierungen, `slideIn`-Animation, Overlay und Styles. Keine eigenen Verbesserungen.

**Akzeptanzkriterien:**
- [x] Build läuft fehlerfrei; Lint identisch mit Stand `3a43042` (keine neuen Meldungen)
- [x] Inhaltsvergleich ohne Leerraum gegen die kaputte Version: nur 2 Unterschiede, `& atmen 💧` wiederhergestellt und doppelter `rndBtn`-Style entfernt
- [x] Onboarding erscheint beim ersten Start, alle 3 Schritte funktionieren, danach stimmen Batterie-Reihenfolge und Start-Habits

**Prüfung:**
- [x] Vergleichsskript im Scratchpad
- [x] Browser (Klicktest durch Anh, 05.10.): Onboarding mit leerem localStorage, danach Menü, Hilfe und Batterie durchklicken, Timer einmal starten

**Abhängigkeiten:** Task 0
**Dateien:** `src/App.jsx`
**Umfang:** S

---

## ✅ Checkpoint 0: Reparatur
- [x] Build und Lint grün, App läuft wie vor dem 29.08., plus Onboarding
- [x] Commit auf `feature/v6`
- [x] **Du entscheidest:** sofort nach `main` (live) → 05.10. live gestellt (`1c7396a`), dopamin-menu.vercel.app liefert den neuen Build aus

---

## Phase 1: Navigation und Home

### Task 2: Footer-Navigation

**Beschreibung:** Fester Glas-Footer mit 5 Tabs (🏠 Home, 🍽️ Menü, 🧩 Breaker, 🩹 Hilfe, 🔋 Batterie) nach CLAUDE.md Abschnitt 1. Die alte Tab-Leiste oben entfällt. Standard-Tab ist `home`. Home und Breaker zeigen vorerst einen einfachen Platzhalter. Der Footer bleibt auch im Timer-Modus sichtbar.

**Akzeptanzkriterien:**
- [x] Alle 5 Tabs schalten um, der aktive Tab ist erkennbar (Punkt oder Hintergrund)
- [x] Kein Inhalt verschwindet hinter dem Footer (Abstand unten ca. 80 px), Safe-Area auf dem iPhone beachtet
- [x] Buttons haben `aria-label` bzw. sichtbare Labels und `aria-current` beim aktiven Tab

**Prüfung:**
- [x] Browser: alle Tabs, Timer läuft und Footer bleibt sichtbar, Onboarding liegt über dem Footer

**Abhängigkeiten:** Task 1
**Dateien:** `src/App.jsx`
**Umfang:** S

---

### Task 2b: Emojis überall durch Icons ersetzen

**Beschreibung:** Wunsch vom 05.10.: einheitliches Design mit bunten Google Material Symbols (Rounded, gefüllt) statt Emojis. Die Grundlage aus Task 2 wird genutzt (`ICON_NAMES`, `Icon`-Komponente, Schrift lädt nur gelistete Icons). Ersetzt werden die Emojis in Daten (Kategorien, Tipps, Batterien, Intervalle, Onboarding) und in der Oberfläche (Buttons, Überschriften, Hinweise). Die SVG-Tiere (Maskottchen, MiniAnimal) bleiben. Vor dem Start klären:
- Was passiert mit **eigenen Inhalten** der Nutzer, etwa dem Emoji-Picker bei eigenen Tipps und den Emojis in selbst angelegten Menü-Einträgen? Vorschlag: Der Picker wird zum Icon-Picker, alte Emoji-Einträge werden weiter angezeigt.
- **Emojis mitten im Satz**, z.B. „Du machst das toll! 💖“ oder „Streck dich wie ein Seestern 🌟“: Icon am Satzende oder ganz weglassen?

**Akzeptanzkriterien:**
- [x] Keine Emojis mehr in fest eingebauten Texten und Daten (Prüfskript zählt 0, Ausnahmen dokumentiert)
- [x] Jedes Icon hat eine Farbe aus der App-Palette und daneben einen sichtbaren Text oder ein `aria-label`
- [x] Gespeicherte Nutzerdaten mit Emojis werden weiterhin korrekt angezeigt

**Prüfung:**
- [x] Emoji-Zählskript; Browser: alle Tabs, Onboarding, Modals, Benachrichtigungen

**Abhängigkeiten:** Task 2
**Dateien:** `src/App.jsx`, `CLAUDE.md` (Design-System: Icons statt Emojis; `BREAKER_CATS` mit Icon-Namen)
**Umfang:** M (eine Datei, aber ca. 150 Stellen; ggf. in 2 Commits teilen: Daten / Oberfläche)

---

### Task 3: Home Teil 1: Motivation, Batterie-Übersicht, „Ich brauch was!“

**Beschreibung:** Abschnitte B, C und E aus CLAUDE.md Abschnitt 2. Motivationstext nach Batterie-Durchschnitt, die 3 niedrigsten Batterien als Karten mit Sprung zum Batterie-Tab, der Zufalls-Button öffnet das vorhandene Modal.

**Akzeptanzkriterien:**
- [x] Alle 6 Textvarianten (5 Stufen und „keine Batterien“) erscheinen passend
- [x] Tap auf eine Batterie-Karte öffnet genau diese Kategorie im Batterie-Tab
- [x] Sonderfälle: keine Batterien → Einrichtungs-Karte; alle über 80 % → „Alle Batterien geladen! 💚“

**Prüfung:**
- [x] Browser: mit leeren Daten, mit Onboarding-Start-Habits und mit überfälligen Habits

**Abhängigkeiten:** Task 2
**Dateien:** `src/App.jsx`
**Umfang:** S

---

### Task 4: Home Teil 2: „Heute dran“ (Habits) und Tipp des Tages

**Beschreibung:** Abschnitt D, vorerst nur mit Habits (die Breaker-Schritte kommen in Task 10), und Abschnitt F. Der Tipp wechselt täglich, mit dem Datum als Startwert für die Zufallsauswahl.

**Akzeptanzkriterien:**
- [x] Die 3 dringendsten Habits mit farbigem Punkt, „Erledigt ✓“ ruft `checkIn` auf und gibt ⭐
- [x] Nichts fällig → „Alles erledigt — gut gemacht! 🌿“
- [x] Der Tipp bleibt am selben Tag gleich; Tap öffnet die passende Hilfe-Kategorie

**Prüfung:**
- [x] Browser; Tipp-Wechsel durch Ändern des Datums im Prüfskript nachvollziehen

**Abhängigkeiten:** Task 3
**Dateien:** `src/App.jsx`
**Umfang:** S

---

## ✅ Checkpoint 1: Navigation und Home
- [x] Alle 5 Tabs erreichbar, Home ohne Scrollen für den Kerninhalt (auf iPhone-Größe)
- [ ] Commit und Push auf `feature/v6` → Vercel-Vorschau gemeinsam ansehen
- [ ] Offene Fragen aus `plan.md` beantwortet (Streak, Löschen, Bearbeiten)

---

## Phase 2: Breaker-Kern

### Task 5: Terminplanung als Funktion und Prüfskript

**Beschreibung:** Hilfsfunktionen oberhalb der Komponente: lokales Datum `YYYY-MM-DD`, Tage addieren, und `planDue(steps, deadline, today)`. Mit Frist werden die Schritte von heute bis heute + 80 % der Resttage verteilt, ohne Frist 1 pro Tag. Von Hand gesetzte Termine (`dueManual`) bleiben erhalten.

**Akzeptanzkriterien:**
- [ ] 5 Schritte und Frist in 10 Tagen → Termine liegen zwischen heute und Tag 8, Schritt 1 ist heute
- [ ] Frist heute oder morgen → alle Schritte heute (kein Datum in der Vergangenheit)
- [ ] Kein Datum → heute, +1, +2 …; Monats- und Jahreswechsel korrekt

**Prüfung:**
- [ ] Prüfskript im Scratchpad (Node) mit diesen Fällen, alle grün

**Abhängigkeiten:** Task 1
**Dateien:** `src/App.jsx`
**Umfang:** XS

---

### Task 6: Rauskippen: Schnelleingabe und Meilenstein-Liste

**Beschreibung:** `tasks`-Zustand mit Speicherung. Breaker-Tab mit Schnelleingabe (Text und optionales Datum, Enter speichert, Fokus bleibt), Bereich „🧩 Noch nicht zerlegt“, geplante Meilensteine, eingeklappte erledigte und ein Empty State mit Raupe.

**Akzeptanzkriterien:**
- [ ] 5 Meilensteine lassen sich in unter 30 Sekunden eintippen (Enter, tippen, Enter …)
- [ ] Sortierung nach Frist, Einträge ohne Datum unten
- [ ] Alte Speicherstände ohne `tasks` laden fehlerfrei

**Prüfung:**
- [ ] Browser inkl. Neuladen; ein alter localStorage-Stand (ohne `tasks`) wird korrekt geladen

**Abhängigkeiten:** Task 2, Task 5
**Dateien:** `src/App.jsx`
**Umfang:** S

---

### Task 7: Fragebogen Pflichtteil

**Beschreibung:** „Zerlegen →“ öffnet den Fragebogen mit einer Frage pro Bildschirm und Fortschrittspunkten. Bildschirm 1: Kategorie-Chips. Bildschirm 2: Schritte aus der Vorlage, bearbeitbar, mit berechneten Terminen. „Fertig zerlegt 🧩“ speichert und öffnet die Schritt-Ansicht. Name und Datum sind hier noch änderbar.

**Akzeptanzkriterien:**
- [ ] Ohne Kategorie geht es nicht weiter; die Vorlage passt zur gewählten Kategorie
- [ ] Schritte lassen sich bearbeiten, löschen und hinzufügen; ein Termin kann von Hand geändert werden (setzt `dueManual`)
- [ ] „← Zurück“ verliert keine Eingaben

**Prüfung:**
- [ ] Browser: einen Meilenstein mit und einen ohne Frist zerlegen

**Abhängigkeiten:** Task 6
**Dateien:** `src/App.jsx`
**Umfang:** M

---

### Task 8: Schritt-Ansicht und Abschluss-Feier

**Beschreibung:** Liste der Schritte mit Checkbox (+1 ⭐), Text bearbeiten, „+1 Tag“ und Datumsfeld, ×, „+ Eigenen Schritt“. Wenn alles erledigt ist: Konfetti, +5 ⭐ und Abschlussnachricht; `completed` wird gesetzt, `lastProgress` wird bei jedem Abhaken aktualisiert.

**Akzeptanzkriterien:**
- [ ] Abhaken gibt genau +1 ⭐, und ein versehentliches Doppel-Tippen gibt nicht doppelt
- [ ] Letzter Schritt → Feier mit +5 ⭐ (die vorhandene Feier zeigt „+1 ⭐“ und muss den Bonus korrekt anzeigen)
- [ ] Der erledigte Meilenstein wandert in „Erledigt“

**Prüfung:**
- [ ] Browser: Sternezähler vor und nach dem Abhaken vergleichen, Neuladen

**Abhängigkeiten:** Task 7
**Dateien:** `src/App.jsx`
**Umfang:** M

---

## ✅ Checkpoint 2: Kernablauf
- [ ] Rauskippen → Zerlegen → Abhaken → Feier funktioniert durchgehend auf Handybreite
- [ ] Commit und Push auf `feature/v6`, gemeinsamer Test in der Vercel-Vorschau

---

## Phase 3: Breaker-Feinschliff

### Task 9: Optionale Fragen

**Beschreibung:** Hinweis „Noch ein paar Fragen? (optional)“, danach einzeln überspringbare Bildschirme: Warum, kleinster erster Schritt (wird Schritt 1), echte oder selbst gesetzte Frist (nur mit Datum), Belohnung (Freitext und Chips aus Sides und Appetizers, keine Entrées). „Warum“ und Belohnung werden in der Schritt-Ansicht angezeigt.

**Akzeptanzkriterien:**
- [ ] Alle 4 Fragen einzeln überspringbar, „Alle überspringen“ möglich
- [ ] Die Belohnungs-Chips enthalten auch selbst angelegte Sides und Appetizers
- [ ] Die Abschluss-Feier nennt die Belohnung („Du hast dir … verdient! 🎁“)

**Prüfung:**
- [ ] Browser: einmal alles ausfüllen, einmal alles überspringen

**Abhängigkeiten:** Task 8
**Dateien:** `src/App.jsx`
**Umfang:** S

---

### Task 10: Fällige Schritte auf Home

**Beschreibung:** „Heute dran“ (Task 4) um bis zu 3 fällige bzw. überfällige Breaker-Schritte erweitern. „Erledigt ✓“ hakt den Schritt ab, ein Tap auf den Text öffnet den Meilenstein.

**Akzeptanzkriterien:**
- [ ] Nur Schritte mit Termin heute oder früher, die überfälligsten zuerst
- [ ] Abhaken auf Home verhält sich genauso wie im Breaker (⭐, Feier beim letzten Schritt)

**Prüfung:**
- [ ] Browser mit einem überfälligen Schritt (Datum per Datumsfeld zurücksetzen)

**Abhängigkeiten:** Task 4, Task 8
**Dateien:** `src/App.jsx`
**Umfang:** S

---

### Task 11: Sanfte Hinweise

**Beschreibung:** Drei Hinweise: (a) Frist vorbei → „Neues Datum oder loslassen 🍃?“ mit Rückfrage in der App (kein `window.confirm`); (b) mehr als 3 Tage ohne Fortschritt → „Steckst du fest? 🐢“ mit Link zur Hilfe; (c) „X Meilensteine warten noch aufs Zerlegen 🐢“.

**Akzeptanzkriterien:**
- [ ] Kein Rot und kein Alarm-Wording
- [ ] „Neues Datum“ berechnet die offenen Schritte neu, von Hand gesetzte Termine bleiben
- [ ] „Loslassen“ entfernt den Meilenstein erst nach Bestätigung

**Prüfung:**
- [ ] Browser mit manipulierten Daten (Frist in der Vergangenheit, `lastProgress` vor 4 Tagen)

**Abhängigkeiten:** Task 8
**Dateien:** `src/App.jsx`
**Umfang:** S

---

## ✅ Checkpoint 3: Fertig
- [ ] Alle Akzeptanzkriterien oben erfüllt
- [ ] CLAUDE.md aktualisiert: Stand v6, 5 Tabs, Onboarding dokumentiert, Abschnitt „Änderungen“ abgeschlossen
- [ ] Merge `feature/v6` → `main` **nach deinem OK** (Vercel stellt live)
