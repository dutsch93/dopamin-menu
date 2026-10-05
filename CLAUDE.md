# CLAUDE.md — Dopamin-Menü 🧸

> Briefing für Coding-Tools (Cursor, Claude Code, Cline).
> Dieses Dokument beschreibt den aktuellen Stand und die nächsten Änderungen.

---

## Projekt-Übersicht

**Name:** Dopamin-Menü
**Typ:** React Web-App (Vite + React, Single-File `App.jsx`)
**Hosting:** Vercel (Auto-Deploy via GitHub Push)
**Zielgruppe:** Menschen mit ADHS
**Stil:** Jellycat-Plüschtier-Ästhetik, Pastellfarben, kawaii, kuschelig
**Datenspeicherung:** localStorage (kein Backend, kein Account)
**Responsive:** Handy + Tablet (max-width: 900px, Media Queries ab 768px)

---

## Aktueller Stand (v5)

Die App hat aktuell **3 Tabs** im oberen Bereich:

### 🍽️ Menü-Tab
- 3 Kategorien: Appetizers (5 Min), Entrées (20 Min), Sides (10 Min)
- Jede Kategorie hat ein Maskottchen: 🐙 Oktopus, 🦊 Fuchs, 🐛 Raupe
- Karten mit Aktivitäten, eigene hinzufügbar
- „Ich brauch was!"-Button: wählt zufällige Aktivität
- Eingebauter Timer mit Fortschrittsring und Maskottchen-Animation
- Belohnungssystem: ⭐ Sterne, 🔥 Streak, ✅ Heute-Zähler
- Konfetti-Feier bei Timer-Abschluss

### 🩹 Hilfe-Tab
- 8 ADHS-Probleme mit Kuscheltier-Maskottchen (🐢🐻🦋🐒🦔🐨🐌🐘)
- Jedes Problem hat 4 wissenschaftlich fundierte Tipps
- 🔬 Button zeigt wissenschaftliche Quellen
- Eigene Tipps pro Kategorie hinzufügbar + löschbar
- Icon-Picker für eigene Tipps (ältere eigene Tipps mit Emoji werden weiter angezeigt)

### 🔋 Batterie-Tab
- 10 Kategorien (Natur, Bewegung, Ruhe, Kreativität, Soziales, Haushalt, Lernen, Schlaf, Ernährung, Selbstpflege)
- SVG-Batterie-Visualisierung mit 5 Farbstufen (Dunkelrot → Grün)
- Habits pro Kategorie mit Gewicht (1–5), automatische Normalisierung auf 100%
- Intervalle: Täglich, Alle 2–3 Tage, Wöchentlich, Alle 2 Wochen, Monatlich
- Erinnerungsoptionen pro Habit: Aus, Wenn überfällig, 1 Tag vorher, 2 Tage vorher
- Split-Ansicht: „Meine Batterien" (konfigurierte) vs. „Weitere Kategorien" (leere)
- Drag & Drop zum Sortieren der Kategorie-Reihenfolge
- Quick-Tips bei Batterie ≤40%: 3 Sofortvorschläge inkl. Verlinkung zur Hilfe
- Durchschnittliche Batterie im Header-Stat-Bereich

### Header
- Dopamin-Menü Titel mit Oktopus + Fuchs Animation
- Stats: ⭐ Sterne, 🔥 Streak, ✅ Heute, 🔋 Energie-Durchschnitt
- 🔔 Notification-Bell mit Badge-Counter
- Notification-Panel: Einstellungen (tägliche Tipps, Menü-Vorschläge), überfällige Habits

---

## ÄNDERUNGEN — Was jetzt gebaut werden muss

> **Wichtig: Keine Emojis in der Oberfläche.** Die App nutzt seit Oktober 2026 bunte Google Material Symbols statt Emojis (siehe Design-System → Icons). Emojis in den Texten dieses Dokuments sind nur Platzhalter. In Buttons und Überschriften wird daraus ein passendes Icon. Steht ein Emoji am Ende eines Satzes (z.B. „Weiter so! 💪“), wird es weggelassen.

### 1. 📱 Footer-Navigation (Glasoptik)

**Was:** Tabs vom oberen Bereich in einen festen Footer verschieben.

**Design:**
- Position: `fixed`, `bottom: 0`, volle Breite (bis max-width des Wrappers)
- Glasoptik: `background: rgba(255, 245, 228, 0.75)`, `backdrop-filter: blur(16px) saturate(180%)`, `-webkit-backdrop-filter: blur(16px) saturate(180%)`, `border-top: 1px solid rgba(200, 168, 233, 0.2)`
- 5 Tab-Icons nebeneinander, zentriert
- Aktiver Tab: farbiger Punkt oder leichter Farbhintergrund unter dem Icon
- Labels unter den Icons in Fredoka, 10px
- Höhe: ca. 64px + `env(safe-area-inset-bottom)` für iPhones mit Notch/Dynamic Island

**Tabs (Reihenfolge):**
1. 🏠 Home (NEU — Startseite, default)
2. 🍽️ Menü
3. 🧩 Breaker (NEU)
4. 🩹 Hilfe
5. 🔋 Batterie

**Technisch:**
- `padding-bottom` auf dem Wrapper erhöhen (ca. 80px), damit Content nicht hinter dem Footer verschwindet
- Alten Tab-Bar (`S.tabBar`) im oberen Bereich komplett entfernen
- Default-Tab auf `"home"` setzen statt `"menu"`
- Footer soll auch im Timer-Modus sichtbar bleiben (nur aktiver Tab wechselt visuell)

---

### 2. 🏠 Home-Dashboard (neuer Startbildschirm)

**Was:** Ein Dashboard das die wichtigsten Infos aus allen Tabs zusammenfasst. Kein Scrollen nötig für den Kerninhalt.

**Layout (von oben nach unten):**

#### A) Header (bleibt wie bisher)
- Titel, Maskottchen, Stats (Sterne, Streak, Heute, Batterie-Durchschnitt, Bell)

#### B) Motivations-Nachricht
- Dynamischer Text basierend auf Batterie-Durchschnitt:
  - >80%: „Du rockst das! Weiter so! 💪"
  - 61–80%: „Gut dabei — bleib dran! 🌟"
  - 41–60%: „Ein kleiner Schritt reicht heute 🌱"
  - 21–40%: „Deine Batterien brauchen Liebe 💛"
  - ≤20%: „Fang mit einer einzigen Sache an 🧸"
- Wenn keine Batterien konfiguriert: „Willkommen! Starte mit dem Menü oder richte deine Batterien ein 🐙"
- Stil: zentriert, Fredoka 14px SemiBold, Farbe passend zum Batterie-Level

#### C) Batterie-Übersicht (Kompakt)
- Nur die 3 niedrigsten Batterien als kleine horizontale Karten:
  - Kategorie-Icon + Name + Mini-Batteriebalken (horizontal, farbig gefüllt) + Prozent
  - Tap öffnet die Batterie-Detailseite (wechselt zu Batterie-Tab + `setOpenCat(catId)`)
- Wenn keine Batterien konfiguriert: Karte mit „🔋 Richte deine erste Batterie ein →" die zum Batterie-Tab navigiert
- Wenn alle Batterien >80%: „Alle Batterien geladen! 💚" Nachricht statt Karten

#### D) Heute dran (Habits + Breaker-Schritte)
- Die 3 dringendsten/überfälligsten Habits über alle Kategorien hinweg
- Pro Habit: Farbiger Dot (rot/gelb/grün) + Habitname + Kategorie-Icon + „Erledigt" Button (mit Icon `check`)
- Tap auf Erledigt = `checkIn(habitId)` + ⭐
- Zusätzlich: Breaker-Schritte, die heute fällig oder überfällig sind (max. 3, überfälligste zuerst). Pro Schritt: 🧩 + Schritttext + Meilenstein-Name (klein) + „Erledigt ✓" Button (hakt den Schritt ab, +1 ⭐). Tap auf den Text öffnet den Meilenstein im Breaker-Tab.
- Wenn nichts fällig ist: „Alles erledigt — gut gemacht! 🌿"

#### E) „Ich brauch was!"-Button
- Gleicher Button wie im Menü-Tab, zentriert
- Öffnet das Random-Pick-Modal wie gehabt

#### F) Tipp des Tages
- Ein zufälliger Tipp aus der Soforthilfe, wechselt täglich (basierend auf `new Date().toDateString()` als Seed)
- Kleine Karte: Tier (`<MiniAnimal type={problemId}/>`) + Tipp-Titel + Kurztext (max 2 Zeilen)
- Tap navigiert zur vollen Hilfe-Kategorie (`setTab("hilfe"); setOpenProb(helpId)`)

---

### 3. 🧩 Breaker: Meilensteine (neuer Tab)

> Ausführliche Herleitung und „Nicht-machen“-Liste: `docs/ideas/breaker-meilensteine.md`

**Konzept:** Wenn der Kopf voll ist, liegt das an vielen Meilensteinen mit Fristen. Der Breaker arbeitet in drei Stufen:
1. **Rauskippen:** Alle Meilensteine schnell eintippen, nur Name und optionales Datum.
2. **Planen:** Jeden Meilenstein später per kurzem Fragebogen in terminierte Schritte zerlegen. Die Kategorie-Vorlage schlägt Schritte vor, die App verteilt die Termine automatisch.
3. **Tun:** Fällige Schritte erscheinen auf dem **Home-Dashboard** (Abschnitt D). Der Breaker-Tab ist zum Sammeln und Planen da, nicht zum täglichen Abarbeiten.

**Kategorien mit Schritt-Vorlagen** (werden beim Planen vorausgefüllt und sind editierbar):

```javascript
const BREAKER_CATS = [
  {
    id: "alltag",
    icon: "home",
    label: "Alltag",
    color: "#F4A0B5",
    steps: [
      "Entscheide wann du es machst",
      "Bereite vor was du brauchst",
      "Mach den ersten kleinen Schritt",
      "Mach weiter oder plane den nächsten Block",
      "Abschließen und aufräumen"
    ]
  },
  {
    id: "soziales",
    icon: "group",
    label: "Soziales",
    color: "#A8D8EA",
    steps: [
      "Nachricht schreiben",
      "Termin oder Zeitpunkt vorschlagen",
      "In Kalender eintragen",
      "Vorbereiten (Ort, Anfahrt, was mitnehmen)",
      "Durchführen und genießen"
    ]
  },
  {
    id: "arbeit",
    icon: "work",
    label: "Arbeit",
    color: "#FFD6A0",
    steps: [
      "Aufgabe in einem Satz definieren",
      "Was brauchst du dafür? (Infos, Tools, Zugang)",
      "Ersten Entwurf / ersten Schritt machen",
      "Überprüfen und anpassen",
      "Abgeben oder kommunizieren"
    ]
  },
  {
    id: "sport",
    icon: "directions_run",
    label: "Sport & Bewegung",
    color: "#B8E8D0",
    steps: [
      "Sportkleidung rauslegen",
      "Tasche packen / Route planen",
      "Schuhe anziehen und losgehen",
      "Training durchziehen (auch nur 10 Min zählt!)",
      "Belohnung: Dusche + etwas Schönes"
    ]
  },
  {
    id: "gesundheit",
    icon: "medical_services",
    label: "Gesundheit",
    color: "#C8A8E9",
    steps: [
      "Nummer oder Website raussuchen",
      "Termin machen (anrufen / online buchen)",
      "In Kalender eintragen + Erinnerung setzen",
      "Unterlagen vorbereiten (Versichertenkarte etc.)",
      "Hingehen"
    ]
  },
  {
    id: "finanzen",
    icon: "savings",
    label: "Finanzen",
    color: "#E8C8A8",
    steps: [
      "Überblick verschaffen (was genau ist zu tun?)",
      "Unterlagen/Zugänge sammeln",
      "Einen konkreten Betrag/Schritt berechnen",
      "Aktion durchführen (überweisen, kündigen, beantragen)",
      "Abhaken und Beleg speichern"
    ]
  },
  {
    id: "kreatives",
    icon: "palette",
    label: "Kreatives",
    color: "#FFB5A7",
    steps: [
      "Inspiration sammeln (1–2 Referenzen reichen)",
      "Material / Tools bereitlegen",
      "Einfach anfangen — perfekt muss es nicht sein",
      "15 Min dranbleiben, dann Pause erlaubt",
      "Ergebnis würdigen — egal wie es aussieht"
    ]
  },
  {
    id: "haushalt",
    icon: "cleaning_services",
    label: "Haushalt",
    color: "#D8B8D8",
    steps: [
      "Einen einzigen Bereich / eine Aufgabe wählen",
      "Timer auf 10 Minuten stellen",
      "Loslegen — nur das Nötigste",
      "Timer klingelt? Entscheide ob du weitermachst oder aufhörst",
      "Aufräumen / Müll rausbringen"
    ]
  }
];
```

**UI-Ablauf:**

#### Ansicht 1: Meilenstein-Liste (Default wenn Tab geöffnet wird)
- Oben die **Schnelleingabe**: Textfeld „Was steht an?" + optionales Datumsfeld (`<input type="date">`). Enter speichert und leert das Feld sofort für den nächsten Eintrag (Fokus bleibt im Textfeld).
- Darunter **„🧩 Noch nicht zerlegt"**: ungeplante Meilensteine (ohne Schritte), nach Frist sortiert, ohne Datum ganz unten. Jede Karte hat den Button „Zerlegen →" und ein × zum Löschen (mit kurzer Rückfrage in der App).
- Wenn ungeplante Meilensteine existieren: sanfter Hinweis „X Meilensteine warten noch aufs Zerlegen 🐢 – fang mit dem dringendsten an".
- Darunter **geplante Meilensteine**: Name + Kategorie-Badge + Frist + Fortschrittsbalken (z.B. „3/5 Schritte"), nach Frist sortiert.
- Erledigte Meilensteine zusammengeklappt darunter (letzte 5, ausgeblendet).
- Wenn keine Meilensteine: Empty State mit Raupe + „Was schwirrt dir im Kopf rum? Kipp's hier raus 🧩"

#### Ansicht 2: Fragebogen (nach Tap auf „Zerlegen →")
Eine Frage pro Bildschirm, Fortschrittspunkte oben, „← Zurück" möglich. Name und Datum kommen aus der Schnelleingabe (hier noch änderbar).
1. **Kategorie (Pflicht):** Kategorie-Chips (Icon + Label) aus `BREAKER_CATS`.
2. **Schritte (Pflicht):** Vorlage der Kategorie ist vorausgefüllt. Text editierbar, Schritte löschbar (×), „+ Eigenen Schritt hinzufügen". Daneben die automatisch berechneten Termine (siehe Terminplanung), einzeln änderbar.
3. Danach Hinweis „Noch ein paar Fragen? (optional)" mit „Überspringen" auf jedem Bildschirm:
   - **Warum ist dir das wichtig?** (ein Satz, Freitext)
   - **Was ist der allerkleinste erste Schritt?** (unter 2 Minuten; wird als Schritt 1 mit `custom: true` vorne eingefügt)
   - **Ist die Frist echt oder selbst gesetzt?** (zwei Chips: „Echt 📌" / „Selbst gesetzt 🌱"; nur wenn ein Datum gesetzt ist)
   - **Deine Belohnung:** Freitext („Serie schauen", „Eis essen") + Vorschlags-Chips aus den Menü-Einträgen der Kategorien **Sides 🐛 und Appetizers 🐙** (inkl. eigener Einträge). **Keine Entrées** – die sind Deep Work, keine Belohnung. Tap auf Chip füllt das Textfeld.
4. Abschluss: „Fertig zerlegt 🧩" → Meilenstein ist geplant, wechselt zur Schritt-Ansicht.

#### Ansicht 3: Schritt-Ansicht (Tap auf geplanten Meilenstein)
- Überschrift: Meilenstein-Name, Kategorie-Badge, Frist (+ 📌/🌱 falls gesetzt)
- **Name und Frist sind antippbar und änderbar.** Bei neuer Frist werden die Termine der offenen Schritte neu berechnet (Schritte mit `dueManual: true` bleiben).
- Dezenter Button **„Meilenstein löschen“** am Ende, mit kurzer Rückfrage in der App (kein `window.confirm`)
- Das **„Warum"** steht oben in einer kleinen Karte (falls ausgefüllt)
- **Belohnung** sichtbar: „🎁 Am Ziel wartet: [Belohnung]"
- Nummerierte Liste der Schritte als Karten. Jeder Schritt hat:
  - Checkbox zum Abhaken → sofort +1 ⭐, zählt außerdem für ✅ Heute und 🔥 Streak (wie eine Menü-Aktivität)
  - Editierbaren Text (Input bei Tap)
  - Fälligkeitsdatum mit „+1 Tag"-Button und Datumsfeld zum Verschieben
  - Löschen-Button (×)
- „+ Eigenen Schritt hinzufügen" am Ende
- Abgehakte Schritte: durchgestrichen, dezente Farbe
- Alle Schritte erledigt → Konfetti + **+5 Bonus-⭐** + groß „Du hast dir [Belohnung] verdient! 🎁" (ohne Belohnung: Motivationsnachricht)
- „← Zurück" Button oben

#### Terminplanung (automatisch, beim Zerlegen und bei Änderung der Frist)
- **Mit Frist:** Zieltermin = heute + 80 % der verbleibenden Tage (Puffer gegen Zeitblindheit). Die offenen Schritte werden gleichmäßig von heute bis zum Zieltermin verteilt, Schritt 1 ist heute fällig. Mehrere Schritte am selben Tag sind erlaubt, wenn die Zeit knapp ist.
- **Ohne Frist:** 1 Schritt pro Tag ab heute.
- Manuell verschobene Termine werden bei Neuberechnung nicht überschrieben (Feld `dueManual: true`).

#### Frist vorbei
- Wenn die Frist überschritten ist und noch Schritte offen sind: sanfte Karte im Meilenstein (und in der Liste) „Die Frist ist vorbei – neues Datum oder loslassen 🍃?"
  - „Neues Datum" → Datumsfeld, Termine der offenen Schritte werden neu berechnet
  - „Loslassen 🍃" → Meilenstein wird nach kurzer In-App-Bestätigung entfernt (kein `window.confirm`), mit freundlicher Nachricht „Losgelassen. Das ist auch eine Entscheidung 🌿"
- Kein Rot, kein Alarm-Wording.

**ADHS-freundliche Details:**
- Schritte sind bewusst klein und konkret formuliert
- Jeder einzelne Schritt gibt sofort einen ⭐ (nicht erst am Ende)
- Kein Druck-Text: „Du kannst jederzeit pausieren"
- Wenn ein geplanter Meilenstein länger als 3 Tage keinen Fortschritt hat (basierend auf `lastProgress`, sonst `created`), erscheint ein sanfter Hinweis: „Steckst du fest? 🐢 Schildkröte hat Tipps →" mit Link zu `setTab("hilfe"); setOpenProb("start")`

**Bewusst NICHT im ersten Release:** Priorität-Feld, Onboarding/Belohnungs-Einstellungen, Timer aus einem Schritt starten, automatische Kategorie-Erkennung, eigene Vorlagen merken, Kopplung an Batterien, wiederkehrende Meilensteine, eigene Benachrichtigungen für Schritte. Begründungen: siehe `docs/ideas/breaker-meilensteine.md`.

**Datenmodell (wird zu localStorage `dopamin_menu_v5` hinzugefügt als `tasks` Array):**

```javascript
{
  id: "t_1696300000000",
  name: "Steuererklärung abgeben",
  deadline: "2026-10-31",      // YYYY-MM-DD oder null (kein Datum)
  deadlineType: "hard",        // "hard" (echt) | "soft" (selbst gesetzt) | null
  category: "finanzen",        // BREAKER_CATS id, null solange ungeplant
  why: "Damit ich ohne Stress in den Urlaub fahre",  // "" wenn übersprungen
  reward: "Eis essen",         // "" wenn übersprungen
  steps: [                     // leer = ungeplant („Noch nicht zerlegt")
    { id: "s1", text: "Ordner öffnen", done: false, custom: true,  due: "2026-10-05", dueManual: false },
    { id: "s2", text: "Unterlagen/Zugänge sammeln", done: false, custom: false, due: "2026-10-10", dueManual: false }
  ],
  created: "2026-10-05T10:00:00.000Z",
  lastProgress: null,          // ISO-Datum des letzten abgehakten Schritts
  completed: null              // ISO-Datum wenn alle Schritte done, sonst null
}
```

---

## Design-System (für alle Komponenten)

### Farben
```css
--primary: #C8A8E9;        /* Lavendel */
--secondary: #FFB5A7;      /* Pfirsich */
--accent: #B8E8D0;         /* Mintgrün */
--bg: #FFF5E4;             /* Creme */
--bg-card: #FFFFFF;
--text: #5B4A6A;           /* Dunkel-Lila (statt Schwarz) */
--text-secondary: #9B8AAE;
--success: #5EC269;
--warning: #F0C040;
--danger: #E86A5A;
--danger-dark: #B83A3A;
```

### Typografie
```css
font-family: 'Fredoka', sans-serif;
/* Import via <style> Tag: */
/* @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap'); */
```

### Icons (statt Emojis)
- **Google Material Symbols Rounded, gefüllt**, geladen per `@import` im `<style>`-Tag (wie Fredoka, keine npm-Dependency)
- In `App.jsx`: `<Icon name="star" color="#E8A820" size={18}/>`. Für gespeicherte Nutzerdaten, die noch ein Emoji enthalten können (eigene Tipps), gibt es `<Ico v={...}/>`.
- **Jedes neue Icon muss in `ICON_NAMES` eingetragen werden.** Google liefert nur gelistete Icons aus (Schrift ca. 13 KB). Fehlt ein Name, erscheint stattdessen das Wort, z.B. „star“. Namen nachschlagen: https://fonts.google.com/icons
- **Farben:** immer bunt aus der Palette, meist der `colorDark`-Ton der jeweiligen Kategorie (auf Creme gut lesbar). Footer: Home `#9B6FCF`, Menü `#E8876F`, Breaker `#D9709A`, Hilfe `#5BA3C0`, Batterie `#4FA97F`. Sterne `#E8A820`, Streak `#F07A4A`, Erledigt `#5EC269`.
- **Barrierefreiheit:** Icons sind dekorativ (`aria-hidden`). Daneben steht immer sichtbarer Text, oder der Button hat ein `aria-label`.
- **Ausnahmen:** Die Tiere bleiben inline-SVG (Maskottchen, `MiniAnimal`). Pfeile in Texten (← →) sind Typografie und bleiben.

### Komponenten-Stil
- Border-Radius: 12–20px (Karten: 16–18px, Buttons: 12–14px, Footer: 0)
- Schatten: `0 2px 10px rgba(180,160,200,.1)` für Karten
- Borders: 2–2.5px solid, Farbe = Kategorie-Farbe
- Buttons: `border:none`, `borderRadius:12`, `fontFamily:'Fredoka',sans-serif`, `fontWeight:600`
- Inputs: `border:2px solid`, `borderRadius:10-12`, `padding:6-8px`

### Animationen (bereits in globalem `<style>` definiert)
```css
@keyframes fadeIn    { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
@keyframes pop       { 0%{transform:scale(.3);opacity:0} 60%{transform:scale(1.15);opacity:1} 100%{transform:scale(1)} }
@keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes wiggle    { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
@keyframes nod       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes bounce    { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(-8px) scaleY(.95)} }
@keyframes checkPop  { 0%{transform:scale(1)} 40%{transform:scale(1.25)} 100%{transform:scale(1)} }
@keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.6} }
@keyframes confetti  { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(-120px) rotate(720deg);opacity:0} }
```

### Glasoptik (NEU — für Footer)
```css
.footer-nav {
  background: rgba(255, 245, 228, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid rgba(200, 168, 233, 0.2);
}
```

### Responsive
```css
/* Wrapper */
max-width: 900px;
margin: 0 auto;

/* Tablet (ab 768px) — größere Grid-Items */
@media (min-width: 768px) {
  .tablet-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; }
  .bat-grid-t  { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important; }
}
```

---

## Datenspeicherung

Alles in einem einzigen localStorage-Key: `dopamin_menu_v5`

```javascript
{
  items: { appetizer: [...], entree: [...], side: [...] },
  stars: 42,
  streak: 5,
  lastDate: "Sat Oct 03 2026",
  doneToday: 3,
  habits: [{ id, name, category, weight, interval, remind, lastDone }],
  customTips: { problemId: [{ id, icon, title, text, custom }] },
  catOrder: ["natur", "bewegung", ...],
  notifSettings: { dailyTip: false, dailyMenu: false },
  tasks: [{ id, name, deadline, deadlineType, category, why, reward, steps: [{id, text, done, custom, due, dueManual}], created, lastProgress, completed }]  // NEU
}
```

---

## Dateistruktur

```
dopamin-menu/
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── App.jsx          ← Gesamte App in einer Datei
│   ├── App.css           (leer)
│   ├── index.css         (leer)
│   └── main.jsx          (Vite-Standard, unverändert)
├── index.html
├── package.json
└── CLAUDE.md             ← dieses Dokument
```

**Wichtig:** Die gesamte App lebt in `src/App.jsx`. Kein Routing, keine separaten Komponenten-Dateien. Alles inline-styled mit einem `S`-Objekt am Ende der Datei. Das ist gewollt — hält die Komplexität niedrig für eine localStorage-only-App.

---

## Technische Hinweise

- **Keine externen Dependencies** außer React (kommt mit Vite)
- **Keine Router-Library** — Tab-Wechsel über `useState`
- **Font:** Fredoka und die Icon-Schrift (Material Symbols) werden per Google Fonts CSS-Import im `<style>`-Tag geladen
- **Icons:** Google Material Symbols über `<Icon>` (siehe Design-System → Icons). Keine Emojis in fest eingebauten Texten oder Daten.
- **SVG:** Alle Tierchen und Batterie-Grafiken sind inline SVG React-Komponenten
- **Notifications:** Browser Notification API (`Notification.requestPermission()` + `new Notification()`)
- **Drag & Drop:** HTML5 native (`onDragStart`, `onDragOver`, `onDrop`)
- **Deutsche Umlaute:** Fredoka unterstützt äöüß. Direkt als UTF-8 in die Datei schreiben, NICHT über Bash-Heredocs (die können Encoding kaputt machen)
- **Styles-Objekt:** Am Ende der Datei als `const S = { ... }` — alle Styles inline, kein CSS-Modul
