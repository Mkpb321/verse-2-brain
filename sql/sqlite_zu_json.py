#!/usr/bin/env python3
"""Exportiert SQLite-Datenbanken in das JSON-Format {"tables": {...}}.

Aufruf (alle drei Dateien im selben Ordner wie das Skript):
    python sqlite_zu_json.py

Oder mit beliebigen SQLite-Dateien als Argumente:
    python sqlite_zu_json.py "meine_datenbank.sqlite" "andere.SQLite3"

Benötigt nur die Python-Standardbibliothek.
"""

import argparse
import json
import sqlite3
from pathlib import Path

STANDARD_DATEIEN = (
    "NA28.SQLite3",
    "BHS(2).SQLite3",
    "LUT.sqlite",
)


def sqlite_zu_json(quelle: Path) -> tuple[Path, dict[str, int]]:
    """Liest alle normalen Tabellen und speichert sie in einer JSON-Datei."""
    if not quelle.is_file():
        raise FileNotFoundError(f"Datei nicht gefunden: {quelle}")

    # Schützt die Quelldatenbank: Sie wird ausschließlich zum Lesen geöffnet.
    with sqlite3.connect(quelle.resolve().as_uri() + "?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row
        tabellen_namen = [
            row[0]
            for row in db.execute(
                "SELECT name FROM sqlite_master "
                "WHERE type = 'table' AND name NOT LIKE 'sqlite_%' "
                "ORDER BY name"
            )
        ]
        tabellen = {}
        anzahl = {}

        for name in tabellen_namen:
            # Tabellennamen sicher als SQL-Bezeichner quotieren.
            sicherer_name = '"' + name.replace('"', '""') + '"'
            datensaetze = [dict(row) for row in db.execute(f"SELECT * FROM {sicherer_name}")]
            tabellen[name] = {"name": name, "rows": datensaetze}
            anzahl[name] = len(datensaetze)

    ausgabe = quelle.with_suffix(".json")
    with ausgabe.open("w", encoding="utf-8") as f:
        json.dump({"tables": tabellen}, f, ensure_ascii=False, indent=4)
        f.write("\n")

    return ausgabe, anzahl


def main() -> None:
    parser = argparse.ArgumentParser(description="Alle SQLite-Tabellen nach JSON exportieren")
    parser.add_argument(
        "dateien", nargs="*", type=Path,
        help="SQLite-Dateien (ohne Angabe: NA28, BHS(2) und LUT neben dem Skript)",
    )
    args = parser.parse_args()
    dateien = args.dateien or [Path(__file__).resolve().parent / name for name in STANDARD_DATEIEN]

    fehler = 0
    for quelle in dateien:
        try:
            ausgabe, anzahl = sqlite_zu_json(quelle)
            print(f"OK: {quelle.name} -> {ausgabe.name}")
            print("    " + ", ".join(f"{name}: {menge}" for name, menge in anzahl.items()))
        except (OSError, sqlite3.Error, TypeError, ValueError) as exc:
            fehler += 1
            print(f"FEHLER bei {quelle}: {exc}")

    if fehler:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
