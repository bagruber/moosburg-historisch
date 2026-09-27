import { useState } from "react";
import { AUSGABEN, ERSTES, HEUTE, lage, naechsteStufe, STUFEN } from "@/lib/jahre";

/**
 * Das Instrument zur Karte: eine Zeitschiene, ein Lineal mit echten
 * Jahresabstaenden, auf dem jede vorhandene Ausgabe eine Marke hat. Die
 * ungleichen Abstaende sind selbst eine Aussage, zwischen 1969 und 1984 liegen
 * fuenfzehn Jahre ohne neues Blatt.
 *
 * Ab lg steht der Block als angedockte Leiste links unter dem Band, darunter
 * als Blatt von unten, das in Ruhe genau Ausgabe und Zeitschiene zeigt
 * (Formsprache-Probe, Punkt 4).
 */
export function Randblock({
  jahr,
  onJahr,
  aufgezogen,
  onAufgezogen,
}: {
  jahr: number;
  onJahr: (j: number) => void;
  aufgezogen: boolean;
  onAufgezogen: (a: boolean) => void;
}) {
  const [offen, setOffen] = useState(false);
  const ausgabe = AUSGABEN.find((a) => a.jahr === jahr);

  return (
    <section className="plate-scroll absolute inset-x-0 bottom-0 z-20 h-[var(--blatt-hoehe)] overflow-y-auto rounded-t-xl border-t border-ink-frame bg-cream px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_18px_rgb(0_0_0/0.08)] lg:static lg:z-auto lg:h-auto lg:w-[25rem] lg:shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:border-ink-frame lg:px-5 lg:pt-4 lg:pb-5 lg:shadow-none">
      <button
        type="button"
        aria-expanded={aufgezogen}
        onClick={() => onAufgezogen(!aufgezogen)}
        className="sticky top-0 -mx-4 flex w-[calc(100%+2rem)] justify-center bg-cream pt-2 pb-3 lg:hidden"
      >
        <span aria-hidden className="h-1 w-9 rounded-full bg-ink-frame" />
        <span className="sr-only">{aufgezogen ? "Blatt schließen" : "Blatt aufziehen"}</span>
      </button>

      <div className="flex items-baseline justify-between">
        <span className="mess-label">Ausgabe</span>
        <span className="font-display text-[26px] font-semibold leading-none tabular-nums lining-nums text-ink">
          {jahr === HEUTE ? "heute" : jahr}
        </span>
      </div>

      <Zeitschiene jahr={jahr} onJahr={onJahr} />

      <p className="mt-2 min-h-[2.6rem] text-[13px] leading-snug text-ink-soft">
        {ausgabe
          ? ausgabe.notiz
          : "Amtliche Basiskarte des Bundes, Stand der laufenden Fortführung."}
      </p>

      <button
        type="button"
        onClick={() => setOffen(!offen)}
        aria-expanded={offen}
        className="mt-2 text-[13px] font-semibold text-red-700 underline underline-offset-2"
      >
        {offen ? "Erläuterung schließen" : "Woher die Karten kommen"}
      </button>
      {offen && (
        <div className="mt-2 space-y-2 text-[13px] leading-snug text-ink-soft">
          <p>
            Die acht Blätter sind Archivscans der Topographischen Karte 1:25 000,
            Blatt 7537 Moosburg a.d.Isar. Jedes deckt dieselbe Fläche ab: 11°50′
            bis 12°00′ östlicher Länge, 48°24′ bis 48°30′ nördlicher Breite.
          </p>
          <p>
            Passgenau werden sie über ihr eigenes Kilometergitter. Die alten
            Blätter tragen die Gradangaben noch auf dem Bessel-Datum. Wer sie für
            heutige Koordinaten nimmt, legt die Karte rund 150 Meter daneben.
          </p>
          <p>
            Für die Gegenwart liegt keine eigene Ebene bereit; dort steht die
            amtliche Basiskarte, damit der Vergleich im selben Register bleibt.
          </p>
        </div>
      )}

      <p className="mt-3 border-t border-ink-line pt-2 text-[12px] leading-snug text-ink-muted">
        Kartengrundlage: Bayerische Vermessungsverwaltung. Gegenwart: TopPlusOpen,
        © Bundesamt für Kartographie und Geodäsie.
      </p>
    </section>
  );
}

function Zeitschiene({ jahr, onJahr }: { jahr: number; onJahr: (j: number) => void }) {
  return (
    <div className="relative mt-2 pb-4">
      {/* Marken der vorhandenen Ausgaben, auf echten Jahresabstaenden. Sie
          hängen über dem Lineal und stoßen an es an, statt es zu überlagern —
          so kommen sie dem Schieber nicht in die Quere. */}
      <div className="relative mb-px h-[11px]">
        {STUFEN.map((s) => (
          <button
            key={s}
            type="button"
            tabIndex={-1}
            onClick={() => onJahr(s)}
            aria-label={s === HEUTE ? "heute" : String(s)}
            className="absolute bottom-0 top-0 -ml-[5px] w-[11px]"
            style={{ left: `${lage(s) * 100}%` }}
          >
            <span
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${
                s === jahr ? "h-[11px] w-[2px] bg-[var(--zeiger)]" : "h-[7px] w-px bg-gold-600"
              }`}
            />
          </button>
        ))}
      </div>
      <input
        type="range"
        className="rule-slider relative"
        min={ERSTES}
        max={HEUTE}
        step={1}
        value={jahr}
        aria-label="Ausgabejahr"
        aria-valuetext={jahr === HEUTE ? "heute" : String(jahr)}
        onChange={(e) => onJahr(naechsteStufe(Number(e.target.value)))}
        // Die Tasten muessen von Ausgabe zu Ausgabe springen. Ueberliesse man
        // sie dem Schrittwert, bewegten sie den Wert um ein Jahr -- und die
        // Rastung schoebe ihn sofort wieder zurueck.
        onKeyDown={(e) => {
          const schritt =
            e.key === "ArrowLeft" || e.key === "ArrowDown"
              ? -1
              : e.key === "ArrowRight" || e.key === "ArrowUp"
                ? 1
                : 0;
          if (!schritt && e.key !== "Home" && e.key !== "End") return;
          e.preventDefault();
          const i = STUFEN.indexOf(jahr);
          const ziel =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? STUFEN.length - 1
                : Math.min(Math.max(i + schritt, 0), STUFEN.length - 1);
          onJahr(STUFEN[ziel]);
        }}
      />
      <div className="mt-1 flex justify-between text-[12px] tabular-nums lining-nums text-ink-muted">
        <span>{ERSTES}</span>
        <span>heute</span>
      </div>
    </div>
  );
}
