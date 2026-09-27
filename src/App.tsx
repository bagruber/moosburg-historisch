import { useEffect, useRef, useState, type CSSProperties } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { Minus, Plus } from "@phosphor-icons/react";
import { Randblock } from "@/components/Randblock";
import { Kopf, PanelInhalt } from "@/components/Kopf";
import { Laden } from "@/components/Laden";
import { AUSGABEN, ERSTES, HEUTE } from "@/lib/jahre";
import {
  BLATT,
  blaetterHinzu,
  grundstil,
  schwenkgrenzen,
  warteAufBlatt,
  zeige,
} from "@/lib/karte";

/** Hoehe des Blatts am Telefon. In Ruhe genau das Instrument, aufgezogen der
 *  Rest. Feste Werte, damit das Aufklappen der Erlaeuterung nichts verschiebt. */
const BLATT_RUHE = "8.25rem";
const BLATT_AUF = "56dvh";

/** Padding fuer fitBounds: ab lg steht die Leiste als eigene Spalte neben der
 *  Karte und braucht kein Polster mehr, darunter liegt das Blatt unten. */
function randabstand() {
  const schmal = window.innerWidth < 1024;
  return schmal
    ? { top: 16, right: 16, bottom: 148, left: 16 }
    : { top: 16, right: 16, bottom: 16, left: 16 };
}

export default function App() {
  const behaelter = useRef<HTMLDivElement>(null);
  const karte = useRef<maplibregl.Map | null>(null);
  const [jahr, setJahr] = useState(AUSGABEN[0].jahr);
  const vorher = useRef<string | null>(null);
  const [bereit, setBereit] = useState(false);
  const [laedtBlatt, setLaedtBlatt] = useState<string | null>(null);
  const [aufgezogen, setAufgezogen] = useState(false);
  // Zoomknoepfe nur mit Maus (Formsprache-Probe, Punkt 9). Einen
  // Standort-Knopf bekommen die Historischen Karten nicht: das Blatt endet am
  // Blattschnitt, ausserhalb hilft der eigene Standort nicht weiter.
  const [maus] = useState(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    if (!behaelter.current) return;
    const protokoll = new Protocol();
    maplibregl.addProtocol("pmtiles", protokoll.tile);

    const m = new maplibregl.Map({
      container: behaelter.current,
      style: grundstil(),
      bounds: [BLATT[0], BLATT[1], BLATT[2], BLATT[3]],
      fitBoundsOptions: { padding: randabstand() },
      minZoom: 11,
      maxZoom: 18,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    });
    m.touchZoomRotate.disableRotation();
    // Meterstab: ab lg unten links neben der Leiste, darunter oben links
    // unter dem Band.
    m.addControl(
      new maplibregl.ScaleControl({ maxWidth: 110, unit: "metric" }),
      window.innerWidth >= 1024 ? "bottom-left" : "top-left",
    );

    m.on("load", () => {
      // Erst jetzt steht der eingepasste Blick fest, aus dem sich die
      // Schwenkgrenzen ableiten.
      m.setMaxBounds(schwenkgrenzen(m));
      blaetterHinzu(m, import.meta.env.BASE_URL);
      vorher.current = AUSGABEN[0].id;
      zeige(m, null, AUSGABEN[0].id, true);
    });
    m.once("idle", () => setBereit(true));

    karte.current = m;
    return () => {
      m.remove();
      maplibregl.removeProtocol("pmtiles");
      karte.current = null;
    };
  }, []);

  useEffect(() => {
    const m = karte.current;
    if (!m || !bereit) return;
    const ziel = AUSGABEN.find((a) => a.jahr === jahr)?.id ?? null;
    if (ziel === vorher.current) return;

    let verworfen = false;
    setLaedtBlatt(jahr === HEUTE ? "Gegenwart wird geladen" : `Blatt ${jahr} wird geladen`);
    warteAufBlatt(m, ziel).then(() => {
      if (verworfen || !karte.current) return;
      zeige(m, vorher.current, ziel, false);
      vorher.current = ziel;
      setLaedtBlatt(null);
    });
    return () => {
      verworfen = true;
    };
  }, [jahr, bereit]);

  return (
    <div
      className="flex h-dvh flex-col"
      style={{ "--blatt-hoehe": aufgezogen ? BLATT_AUF : BLATT_RUHE } as CSSProperties}
    >
      <Kopf
        titel="Historische Karten"
        zahl={String(AUSGABEN.length)}
        einheit={`Ausgaben seit ${ERSTES}`}
        zeigeKennzahl={bereit}
        laedtNach={laedtBlatt ?? undefined}
        panel={
          <PanelInhalt
            name="Historische Karten Moosburg"
            satz="Topographische Karte 1:25 000, Blatt 7537. Acht Ausgaben, deckungsgleich übereinandergelegt."
            repo="https://github.com/bagruber/moosburg-historisch"
          />
        }
      />

      <div className="relative min-h-0 flex-1 lg:flex">
        <Randblock
          jahr={jahr}
          onJahr={setJahr}
          aufgezogen={aufgezogen}
          onAufgezogen={setAufgezogen}
        />
        <div className="relative h-full overflow-hidden lg:flex-1">
          <div ref={behaelter} className="h-full w-full" />
          {maus && (
            <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-md border border-ink-frame bg-cream shadow-soft">
              <Kartenknopf label="Hineinzoomen" onClick={() => karte.current?.zoomIn()}>
                <Plus size={17} aria-hidden />
              </Kartenknopf>
              <Kartenknopf label="Herauszoomen" onClick={() => karte.current?.zoomOut()}>
                <Minus size={17} aria-hidden />
              </Kartenknopf>
            </div>
          )}
          {!bereit && <Laden />}
        </div>
      </div>
    </div>
  );
}

function Kartenknopf({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-[34px] w-[34px] place-items-center text-ink hover:bg-cream-dark [&+&]:border-t [&+&]:border-ink-line"
    >
      {children}
    </button>
  );
}
