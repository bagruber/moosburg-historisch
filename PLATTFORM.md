# Plattform-Kontext

Wo diese App läuft und was beim Ändern zu beachten ist. Der übergreifende
Kontext steht im Repo `bagruber/moosburg-eu` in `BRIEFING.md`.

*Stand: September 2026*

---

## Zwei Adressen, zwei Builds, ein Branch

| | Adresse | Basispfad | Build |
|---|---|---|---|
| GitHub Pages | `bagruber.github.io/moosburg-historisch/` | `/moosburg-historisch/` | `pnpm build` (`.github/workflows/pages.yml`) |
| moosburg.eu | `moosburg.eu/data/historisch/` | `/data/historisch/` | `pnpm build:hostinger` (`moosburg-eu.yml`) |

Der Basispfad für moosburg.eu steht **nicht** in `vite.config.ts`, sondern im
Script-Eintrag `build:hostinger` als `--base=/data/historisch/`. Eine Änderung an
`base` in der Config bräche immer eine der beiden Varianten. Auf dem Server heißt
der Ordner `historisch`, nicht wie das Repo.

Die App liegt auf moosburg.eu unterhalb von `/data/`, wo `datahub` die Wurzel
belegt. Dessen Deploy überträgt nur geänderte Dateien und löscht nichts, deshalb
stören sich die beiden nicht. Wer dort je `dangerous-clean-slate` aktiviert,
löscht diese App mit.

## Der Deploy braucht mehr Zeit als die Geschwister

`timeout: 300000` statt der sonst üblichen 120 s. Grund sind die rund 100 MB
Kacheln und das gemeinsame FTP-Konto: läuft parallel ein anderer Deploy, nimmt
Hostinger die Verbindung erst nach Minuten an, und der Lauf endete genau daran
schon einmal mit `Timeout (control socket)`.

## Offen: Zählung einbinden

Die Zeile `<script src="/assets/zaehler.js" defer></script>` fehlt noch vor
`</body>` in `index.html`, mit absolutem Pfad. Die App hat nur eine Ansicht, der
Aufruf beim Laden genügt, ein Routenwechsel ist nicht zu melden. Auf GitHub
Pages läuft der Aufruf absichtlich ins Leere, damit die Pages-Zwillinge die
Zahlen nicht verdoppeln.

Warum die Zählung ohne Einwilligungsbanner auskommt, und warum deshalb hier
niemals eine Sitzungs-ID in `sessionStorage` oder `localStorage` nachgerüstet
werden darf, steht in `bagruber/moosburg-eu`, `README.md`, Abschnitt „Zählen".
