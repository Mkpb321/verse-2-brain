# Verse2Brain

Eine schlanke, mobilfreundliche Bibelvers-Liste mit Texten der **Schlachter 2000 (SLT 2000)**, Darkmode und optionalen Medien.

## Starten

1. `slt2000.json` neben `index.html` ablegen (die Bibeltext-Datei ist **nicht** im Download enthalten).
2. Im Projektordner einen lokalen Webserver starten, z. B. mit `python3 -m http.server 8000`.
3. `http://localhost:8000` im Browser öffnen. Ohne Webserver lässt sich die JSON-Datei bei Bedarf auch manuell auswählen.

## Bedienen

- **Vers hinzufügen:** Stelle ins Suchfeld eingeben, z. B. `Joh 3,16`, `1. Mose 1:1` oder `1 Kor 5,5`, und `↵` drücken. Abkürzungen, deutsche/englische Namen und Tippfehler werden berücksichtigt.
- **Liste:** `▸/▾` klappt einzelne Verse auf/zu, `×` löscht sie. Am **Sechs-Punkte-Griff** per Maus oder Touch verschieben; mit Tastatur: Leertaste, Pfeiltasten, Enter. Die Leiste steuert alle Einträge.
- **Einzelansicht:** Vers anklicken; `←` führt zurück. Grauer Fließtext zeigt die Nachbarverse.
- **Einstellungen (`⚙`):** Darkmode, Anzahl der Verse davor/danach (0 = keine), Checkboxen **Audio** (auch Video) und **Bild**. Liste, Reihenfolge, Klappzustände und Einstellungen bleiben im Browser gespeichert.

## Eigene Medien

Dateien im Ordner `media/` müssen **genau wie die angezeigte Versangabe** heißen:

```text
media/
  1 Kor 5,5.m4a
  1 Kor 5,5.jpg
  Joh 3,16.mp3
```

Medien erscheinen nur in der Einzelansicht **unter den Nachbarversen**. Fehlen sie oder sind sie in den Einstellungen ausgeschaltet, wird nichts angezeigt. Bei mehreren Formaten wählt die App das erste vom Browser unterstützte Audio-/Videoformat bzw. das erste ladbare Bild. Für iPhones vorzugsweise **M4A oder MP3** statt OGG verwenden. `favicon/` enthält die App-Icons.

**Hinweis:** Medien, JSON und Einstellungen verbleiben lokal bzw. auf deinem eigenen Webserver; es gibt kein Benutzerkonto oder Backend. Prüfe die Nutzungsrechte deiner Bibeltexte und Medien vor einer Veröffentlichung.
