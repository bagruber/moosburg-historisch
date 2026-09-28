# Formsprache in den Historischen Karten: Ergebnis der Probe

*Stand 28.09.2026. Gebaut auf `probe/formsprache`, **nicht gemergt und nicht
gepusht**. Die Entscheidungen sind **vorläufig**: Kanon ist allein
`../moosburg-design/css/theme.css`, das Protokoll dort führt den Verlauf.*

Grundlage: `../moosburg-design/docs/formsprache/briefing-karten.md` (AP 0 bis 10) und
die Vorlage [Karten, erste Lesung](https://claude.ai/artifact/P9KpGjEkzRw94DcB2hZ8Rw),
Version 3. Vorher- und Nachher-Aufnahmen bei 390 × 844 und 1440 × 900 liegen lokal
unter `vorher/` und `nachher/` (per `.git/info/exclude` ausgenommen), aufgenommen
unter `/data/historisch/`.

## Was jetzt gilt

| Bereich | Umsetzung | Commit |
|---|---|---|
| Kanon und Pakete | `moosburg-design` von 0.1.0 auf 0.3.0, Phosphor aufgenommen, alle Ranges auf die Hausbasis gezogen. | `09b0d31` |
| Schrift | `.headline`, `.eyebrow` und `.label` gelöscht, dafür `.mess-label`: Satzschreibung, 13 px, halbfett, `ink-soft`. Kicker „Moosburg an der Isar" entfallen, er stand im Wechsel mit dem Ladetext. | `656e12c` |
| Kleinster Lesegrad | 12 px. Vorher 0,62 bis 0,75 rem, der Quellenvermerk stand auf 0,66 rem, also 10,6 px. | `656e12c` |
| Kopfband | Stripe, darunter das Band in Erdbraun. Kennzahl „8 Ausgaben seit 1960", gerechnet aus `AUSGABEN.length` und `ERSTES`, nicht geschrieben. | `656e12c` |
| Panel | Wie im Data Hub, Inhalt mit dem Satz aus AP 9: „Topographische Karte 1:25 000, Blatt 7537. Acht Ausgaben, deckungsgleich übereinandergelegt." | `656e12c` |
| Seitenleiste | Ab `lg` 400 px (vorher ein schwebender Block von 21 rem mit 16 px Abstand). `randabstand()` entsprechend: links kein Polster mehr. | `656e12c` |
| Blatt am Telefon | Von unten, 8 px, Griff als Knopf mit `aria-expanded`. In Ruhe 8,25 rem: genau Ausgabe und Zeitschiene. Aufgezogen 56 dvh: Notiz, Erläuterung, Quellen. | `656e12c` |
| Zeiger | `--zeiger: var(--color-thema-erdbraun)`. Der Schieber der Zeitschiene und die gewählte Marke nehmen ihn, die übrigen Marken bleiben Gold-600. | `656e12c` |
| Kartenknöpfe | Eigene Gruppe oben rechts mit Phosphor `Plus` und `Minus`, 4 px. Nur mit Maus. **Kein Standort-Knopf**, wie im Briefing. | `656e12c` |
| Meterstab | Wie in der Baumkarte. Ab `lg` unten links, darunter oben links. | `656e12c` |
| Erstes Laden | Drei Kacheln mit Rosen auf der Kartenfläche, mittlere in Erdbraun. Verschwindet beim ersten `idle`, erst dann erscheint die Kennzahl. | `656e12c` |
| Nachladen | Beim Wechsel der Ausgabe steht an der Stelle der Kennzahl eine drehende Rose in Gold-200 mit „Blatt 1984 wird geladen". Das alte Blatt bleibt stehen, bis das neue da ist. | `656e12c` |
| Gedankenstriche | Die beiden Sätze aus AP 9 neu gesetzt, Punkt statt Gedankenstrich. | `656e12c` |
| Titel | `<title>` von „Moosburg historisch" auf „Historische Karten Moosburg". | `656e12c` |

## Die beiden Ersatzvarianten

**Punkt 7A, Zeiger in Rot.** Eine Zeile in `src/index.css`, die Ersatzzeile steht als
Kommentar darüber:

```css
:root {
  --zeiger: var(--color-thema-erdbraun);
  /* Ersatz 7A: --zeiger: var(--color-red-700); */
}
```

Schieber und gewählte Marke lesen beide die Variable, die Marke über
`bg-[var(--zeiger)]` in `src/components/Randblock.tsx`.

**Punkt 6, gesetzte Filter in Gold.** Betrifft die Historischen Karten **nicht**, sie
haben keine Chips und keinen Filterknopf. Die Probe liegt allein in den Speisekarten.

## Beobachtungen aus AP 4

**Der Erdbraun-Zeiger neben Gold-600: 3,15:1.** Die gewählte Marke steht in Erdbraun,
die übrigen sieben in Gold-600, beide auf Creme. Das trennt gut: die gewählte Marke
ist zusätzlich doppelt so hoch und doppelt so breit, die Farbe ist die zweite
Codierung. Anders als in der Baumkarte gibt es hier keine Datenfarbe in der Nähe der
Themenfarbe, das Problem mit dem Baumgrün tritt nicht auf.

**Der Zeiger auf dem Kartenbild.** Der Schieber liegt im Blatt, nicht auf der Karte,
und steht dort auf Creme mit 12,02:1. Die Blätter von 1960 bis 1995 sind
schwarz-grau-braun, also im selben Farbkreis wie Erdbraun. Auf der Karte begegnen
sich die beiden nirgends, aber wenn du 7C familienweit setzt, ist das die Stelle, an
der Themenfarbe und Kartenbild einander am nächsten kommen.

## Messwerte

| Stelle | Wert |
|---|---|
| Creme auf dem Band (Erdbraun) | 12,02:1 |
| Gold-200 auf dem Band (Kennzahl) | 8,86:1 |
| Rücklink, Creme 85 % auf dem Band | 9,12:1 |
| Einheit, Creme 82 % auf dem Band | 8,60:1 |
| `ink-soft` auf Creme (`.mess-label`, Meterstab) | 6,98:1 |
| `ink-muted` auf Creme (12 px, Quellenvermerk) | 4,96:1 |
| Erdbraun-Zeiger auf Creme | 12,02:1 |
| Erdbraun-Zeiger gegen Gold-600 (übrige Marken) | 3,15:1 |

| Größe | Messwert |
|---|---|
| Seitenleiste ab `lg` | 400 px |
| Blatt in Ruhe / aufgezogen | 8,25 rem / 56 dvh |
| `scrollWidth` / `clientWidth` bei 390 px | 390 / 390 |
| `scrollWidth` / `clientWidth` bei 1440 px | 1440 / 1440 |

## Prüfungen

- `pnpm typecheck`, `pnpm build`, `pnpm build:hostinger` grün.
- `grep -rn "uppercase\|eyebrow\|headline\|\.label\|Inter\|Playfair" src` leer.
- `grep -rnE "text-\[0\.[0-6][0-9]*rem\]|text-\[1[01]px\]|font-size: 0\.[0-6]" src` leer.
- Keine Konsolenfehler, keine 404.
- Kein waagrechter Überlauf bei 390 und 1440 px.
- Tastatur bei 390: Rücklink, Panel, Griff des Blatts, Zeitschiene, Erläuterung,
  Karte, zwei Kartenknöpfe. Panel: `aria-expanded` wechselt, Esc schließt, der Fokus
  kehrt zum Knopf zurück. Die Tasten der Zeitschiene springen weiter von Ausgabe zu
  Ausgabe, `Home` und `End` an die Enden.
- Nachladen belegt: Mit künstlich um 1,2 s verzögerten PMTiles steht im Band
  „Blatt 1984 wird geladen" mit drehender Rose (`nachher/nachladen-band.png`), das
  alte Blatt bleibt sichtbar.

## Gefundene Fehler und offene Punkte

- **MapLibres Stylesheet stand im Bundle hinter unseren Regeln**, wie in den anderen
  beiden Karten. Der Import ist nach `index.css` gewandert, vor die eigenen Regeln.
- **`isSourceLoaded` taugt nicht als Signal fürs Nachladen.** Eine Rasterquelle, für
  die noch keine Kachel angefordert wurde, meldet sich sofort als geladen. Das Warten
  war damit wirkungslos, die Kennzahl blieb stehen und das Wort erschien nie. Gewartet
  wird jetzt auf `idle`, das erst fällt, wenn die neu sichtbare Ebene ihre Kacheln hat
  (`src/lib/karte.ts`, `warteAufBlatt`).
- **Die Ruhehöhe des Blatts musste nachgemessen werden.** Mit 10,5 rem lugte die erste
  Zeile der Ausgabennotiz unter der Kante hervor und sah aus wie ein Fehler. 8,25 rem
  schneidet sauber hinter der Zeitschiene ab.
- **Der Meterstab am Telefon steht über der farbigen TopPlusOpen** und kollidiert dort
  gelegentlich mit einem Ortsnamen („2 km" über „Schweinersdorf"). Der Creme-Hof hält
  ihn lesbar, schön ist es nicht. Die Historischen Karten sind die einzige der drei,
  die ihre Grundkarte farbig behält, deshalb tritt es nur hier auf.
- **Ein Commit statt acht**, aus demselben Grund wie in der Baumkarte: die Pakete
  teilen sich `index.css`, `App.tsx` und `Randblock.tsx`.
