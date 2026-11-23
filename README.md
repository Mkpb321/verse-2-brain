# Verse2Brain

Eine schlanke, mobilfreundliche Bibelvers-Liste mit Texten der **Schlachter 2000 (SLT 2000)**, hebräischem Urtext aus **BHS** (Altes Testament), griechischem Urtext aus **NA28** (Neues Testament), Darkmode und optionalen Medien.

## Starten

1. Die drei Bibeltext-Dateien **neben `index.html`** ablegen (sie sind **nicht im ZIP enthalten**):
   - `slt2000.json` – deutscher Bibeltext (hochgeladen als `slt2000(3).json`)
   - `BHS.json` – hebräischer Urtext für das Alte Testament
   - `NA28.json` – griechischer Urtext für das Neue Testament (hochgeladen als `NA28(2).json`)

   **Wichtig:** Die Dateinamen müssen exakt stimmen, einschließlich Groß-/Kleinschreibung.
2. Im Projektordner einen lokalen Webserver starten, z. B. mit `python3 -m http.server 8000`.
3. `http://localhost:8000` im Browser öffnen. Ohne Webserver lassen sich die Bibeltextdateien bei Ladefehlern in den jeweiligen Ansichten manuell auswählen.

## Bedienen

- **Vers hinzufügen:** Stelle ins Suchfeld eingeben, z. B. `Joh 3,16`, `1. Mose 1:1` oder `1 Kor 5,5`, und `↵` drücken. Abkürzungen, deutsche/englische Namen und Tippfehler werden berücksichtigt.
- **Liste:** `▸/▾` klappt einzelne Verse auf/zu, `×` löscht sie. Am **Sechs-Punkte-Griff** per Maus oder Touch verschieben; mit Tastatur: Leertaste, Pfeiltasten, Enter. Die Leiste steuert alle Einträge.
- **Einzelansicht:** Vers anklicken; `←` führt zurück. Nur **Lesen** zeigt die konfigurierten Nachbarverse. Die drei Lernmodi verbergen sie:
  - **Anfangsbuchstaben tippen:** Jeweils den ersten Buchstaben des nächsten Wortes eingeben. Nach einem Fehler wird das richtig aufgedeckte Wort rot; Satzzeichen erscheinen automatisch. Am Ende **Restart** drücken.
  - **Wort für Wort:** Einfach **irgendwo tippen oder klicken**, um jeweils das nächste Wort aufzudecken; am Ende **Restart**.
  - **Anfangsbuchstaben anzeigen:** Nur die Initialen mit Satzzeichen sehen, den Vers selbst aufsagen und bei Bedarf über **Text anzeigen** kontrollieren.
  - **Urtext:** Oberhalb des deutschen SLT-2000-Verses wird im AT die **BHS** auf Hebräisch (rechts nach links, zwei Schriftgrößenstufen größer) und im NT die **NA28** auf Griechisch (eine Schriftgrößenstufe größer) angezeigt. Die benötigte JSON wird erst bei der ersten Nutzung geladen. Strong-Nummern sowie textkritische Fußnotenzeichen werden nicht als Verswörter angezeigt. Bei abweichender Verszählung steht die Quellversangabe neben „BHS“ bzw. „NA28“. In Psalmen können die zusammengezogenen Überschriften zusätzlich im BHS-Vers enthalten sein.
- **Einstellungen (`⚙`):** Darkmode, Anzahl der Verse davor/danach (0 = keine), Checkboxen **Audio** (auch Video) und **Bild**. Liste, Reihenfolge, Klappzustände und Einstellungen bleiben im Browser gespeichert.

## Eigene Medien

Dateien im Ordner `media/` müssen **genau wie die angezeigte Versangabe** heißen:

```text
media/
  1 Kor 5,5.m4a
  1 Kor 5,5.jpg
  Joh 3,16.mp3
```

Medien erscheinen ausschließlich im Modus **Lesen**, in der Einzelansicht **unter den Nachbarversen**. In den Lernmodi sowie in **Urtext** werden Audio, Video und Bilder ausgeblendet und nicht geladen. Fehlen sie oder sind sie in den Einstellungen ausgeschaltet, wird nichts angezeigt. Bei mehreren Formaten wählt die App das erste vom Browser unterstützte Audio-/Videoformat bzw. das erste ladbare Bild. Für iPhones vorzugsweise **M4A oder MP3** statt OGG verwenden. App-Icons unter `favicon/` sind optional; sie waren in den bereitgestellten Quelldateien nicht enthalten.

**Hinweis:** Medien, JSON und Einstellungen verbleiben lokal bzw. auf deinem eigenen Webserver; es gibt kein Benutzerkonto oder Backend. Prüfe die Nutzungsrechte deiner Bibeltexte und Medien vor einer Veröffentlichung.
