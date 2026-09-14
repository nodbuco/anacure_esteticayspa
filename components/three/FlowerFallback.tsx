import { COLORES, crearAleatorio, elegirPaleta, PETALO_SVG } from "./petalo";

/**
 * Fondo 2D: las mismas flores como SVG estático. Se pinta siempre desde el primer
 * render (sin JavaScript) y es lo único que ven quienes tienen «reducir movimiento»,
 * dispositivos justos o conexiones lentas. Cuando el 3D está listo, se desvanece.
 * El desplazamiento con el scroll lo hace CSS (animation-timeline: scroll()).
 */
interface Flor2D {
  xm: number; ym: number; xd: number; yd: number; // posición % móvil / escritorio
  tam: number; petalos: number; rot: number; deriva: number; petalo: string; centro: string; apertura: number;
}

function generar(): Flor2D[] {
  const rnd = crearAleatorio(1109);
  const flores: Flor2D[] = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const p = elegirPaleta(rnd);
    const r = rnd();
    flores.push({
      // Móvil: esquina superior derecha y borde derecho, lejos del titular
      xm: r < 0.55 ? 48 + rnd() * 58 : 84 + rnd() * 24,
      ym: r < 0.55 ? 1 + rnd() * 16 : 24 + rnd() * 50,
      xd: r < 0.75 ? 52 + rnd() * 48 : rnd() * 22,
      yd: r < 0.75 ? rnd() * 90 : 60 + rnd() * 40,
      tam: 56 + rnd() * 96,
      petalos: 6 + Math.floor(rnd() * 3),
      rot: rnd() * 360,
      deriva: -(40 + rnd() * 90),
      petalo: p.petalo,
      centro: p.centro,
      apertura: 0.55 + rnd() * 0.35,
    });
  }
  return flores;
}

const FLORES = generar();

export function FlowerFallback({ oculto }: { oculto: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-luxe"
      style={{ opacity: oculto ? 0 : 1, visibility: oculto ? "hidden" : "visible", transitionProperty: "opacity, visibility" }}
    >
      {FLORES.map((f, i) => (
        <div
          key={i}
          className="flor-2d absolute"
          style={
            {
              "--x-m": `${f.xm}%`,
              "--y-m": `${f.ym}%`,
              "--x-d": `${f.xd}%`,
              "--y-d": `${f.yd}%`,
              "--rot": `${f.rot}deg`,
              "--d": `${f.deriva}px`,
              "--tam": `${f.tam}px`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g transform="translate(50 50)">
              {Array.from({ length: f.petalos }, (_, k) => (
                <path
                  key={k}
                  d={PETALO_SVG}
                  fill={f.petalo}
                  opacity={0.9}
                  transform={`rotate(${(k * 360) / f.petalos}) translate(-50 -50) translate(0 -${8 + (1 - f.apertura) * 6}) scale(0.5) translate(50 0)`}
                />
              ))}
              <circle r="4.5" fill={f.centro} />
            </g>
          </svg>
        </div>
      ))}
      <span className="sr-only">{COLORES.fondo}</span>
    </div>
  );
}
