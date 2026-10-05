# 🧩 Breaker: Meilensteine rauskippen, zerlegen, Schritt für Schritt erledigen

*Ergebnis der Ideen-Session vom 05.10.2026. Ersetzt das bisherige Breaker-Konzept in der CLAUDE.md (eine Aufgabe, kein Datum, kein Fragebogen).*

## Problemstellung

*Wie könnten wir Menschen mit ADHS, deren Kopf wegen vieler Meilensteine voll ist, in Sekunden entlasten und jeden Meilenstein danach in kleine, terminierte Schritte verwandeln, sodass sie täglich nur sehen, was heute dran ist?*

## Empfohlene Richtung

Der Breaker arbeitet in **drei Stufen**. Die Erleichterung kommt schon in der ersten Stufe, nicht erst nach der Planung.

1. **Rauskippen:** Eine Schnelleingabe nur mit Name und optionalem Datum. Nach Enter kommt sofort das nächste Feld. In 30 Sekunden ist alles aus dem Kopf.
2. **Planen:** Ungeplante Meilensteine tragen das Label „🧩 Noch nicht zerlegt“. Ein kurzer Fragebogen macht daraus Schritte: Die Kategorie-Vorlage schlägt Schritte vor, und die App verteilt sie **rückwärts ab der Frist**, mit Puffer. Der Nutzer passt nur noch an.
3. **Tun:** Fällige und überfällige Schritte erscheinen auf dem **Home-Dashboard** neben den Habits. Der Breaker-Tab ist zum Sammeln und Planen da, Home zum Erledigen.

Die Belohnung pro Meilenstein ist **Freitext mit Vorschlägen aus dem Menü**: Man tippt etwas Eigenes ein („Serie schauen“, „Eis essen“) oder tippt einen Vorschlag aus 🐛 Sides oder 🐙 Appetizers an. Die 🦊 Entrées sind bewusst nicht dabei, weil sie Deep Work sind und keine Belohnung. Jeder Schritt gibt sofort ⭐. So entsteht kein eigenes Belohnungs-System in den Einstellungen.

## Annahmen, die wir prüfen müssen

Am besten selbst eine Woche lang mit echten Meilensteinen testen.

- [ ] **Rauskippen allein bringt schon Erleichterung.** Test: Fühlt es sich nach dem Eintippen besser an, auch ohne zu planen?
- [ ] **Ungeplante Meilensteine werden später wirklich geplant.** Test: Wie viele sind nach 7 Tagen noch ungeplant?
- [ ] **Die automatischen Schritt-Termine passen ungefähr.** Test: Wie oft muss ein Termin verschoben werden? Ist es mehr als die Hälfte, ist die Verteilung schlecht.
- [ ] **Eine Belohnung aus dem Menü motiviert.** Test: Wird sie am Ende wirklich abgeholt?
- [ ] **Home statt Breaker-Tab reicht fürs Tun.** Test: Wird der Breaker-Tab trotzdem täglich geöffnet, um alles zu sehen?

## Umfang fürs erste Release

**Drin:**

- **Schnelleingabe:** Name und optionales Datum, Enter für den nächsten Eintrag. „Kein Datum“ ist erlaubt.
- **Meilenstein-Liste:** zuerst ungeplante, dann geplante, jeweils nach Frist sortiert, mit Fortschrittsbalken.
- **Fragebogen:**
  - Pflicht: Kategorie wählen. Name und Datum stammen schon aus der Schnelleingabe.
  - Schritte: Die Vorlage ist vorausgefüllt. Man kann Text bearbeiten, Schritte hinzufügen und löschen.
  - Automatische Termine rückwärts ab der Frist. Geplant wird so, dass alles bei etwa 80 % der Zeit fertig ist (Puffer gegen Zeitblindheit).
  - Optional, eine Frage pro Bildschirm und überspringbar: *Warum ist dir das wichtig?*, *Kleinster erster Schritt?*, *Echte oder selbst gesetzte Frist?*, *Deine Belohnung (Freitext, Vorschläge aus Sides und Appetizers)*.
- **Schritt-Ansicht:** Abhaken gibt ⭐. Man kann Text bearbeiten und einen Schritt um +1 Tag oder per Datumsfeld verschieben. Das „Warum“ steht oben.
- **Abschluss:** Konfetti, Bonus-⭐ und groß angezeigt „Du hast dir *[Belohnung]* verdient! 🎁“
- **Home, Abschnitt D:** fällige und überfällige Schritte zusammen mit den Habits.
- **Sanfter Hinweis**, wenn ein Meilenstein länger als 3 Tage keinen Fortschritt hat: „Steckst du fest? 🐢 →“ führt zur Hilfe-Kategorie `start`.

## Nicht-machen-Liste (und warum)

- **Priorität:** Bei ADHS ist meist alles „hoch“. Frist plus „echt oder selbst gesetzt“ sagen mehr.
- **Onboarding und eigene Belohnungs-Einstellungen:** Das Menü ist schon die Belohnungsliste. Ein Onboarding wäre ein eigenes Feature.
- **Timer direkt aus einem Schritt starten:** Kommt erst nach dem ersten Release. Lässt sich leicht nachrüsten, sobald der Kernablauf trägt.
- **Kategorie automatisch per Stichwort erkennen:** Komfort, erst nötig, wenn die Kategorie-Wahl wirklich nervt.
- **Eigene Vorlagen merken:** Lohnt sich erst, wenn dieselbe Art Meilenstein wiederholt angelegt wird.
- **Schritte laden die Batterie:** Tasks und Habits sind verschiedene Dinge, und das Zuordnen macht es kompliziert.
- **Wiederkehrende Meilensteine:** v2.
- **Plan B (WOOP), Accountability-Person, Schwere 1–5:** gute Ideen, aber sie verlängern den Fragebogen. Erst einbauen, wenn der kurze Fragebogen funktioniert.
- **Eigene Erinnerungen für Schritte:** Die Anzeige auf Home reicht fürs Erste. Die Glocke könnte man später erweitern.

## Entscheidungen (05.10.2026)

- **Frist vorbei:** Sanft fragen „Neues Datum oder loslassen 🍃?“, ohne roten Alarm.
- **Bonus für einen ganzen Meilenstein:** +5 ⭐.
- **Kein Datum:** Die Schritte werden mit 1 Schritt pro Tag ab heute geplant.
- **Belohnung:** Freitext mit Vorschlägen aus Sides und Appetizers, keine Entrées (Deep Work).
- Der Abschnitt „3. Task Breaker“ in der **CLAUDE.md** ist an dieses Konzept angepasst.
