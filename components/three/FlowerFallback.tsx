import { disposicion, PALETAS, PETALO_SVG } from "./petalo";

/**
 * Fondo 2D: las mismas flores, en las mismas posiciones y tamaños que el 3D, como SVG.
 * Existe en el HTML desde el primer byte (sin JavaScript); cuando el 3D está listo se
 * desvanece y las flores «cobran vida» en el mismo sitio. En dispositivos sin 3D es el
 * fondo definitivo: entra con una floración en CSS y deriva con el scroll.
 */
const ESCRITORIO = disposicion(false);
const MOVIL = disposicion(true);

function Flor({ f, i, escritorio }: { f: (typeof ESCRITORIO)[number]; i: number; escritorio: boolean }) {
  const p = PALETAS[f.paleta];
  const interiores = f.petalos - 2;
  const apertura = 0.62 + 0.15 * Math.abs(Math.sin(i * 2.3));
  return (
    <div
      className={`flor-2d absolute ${escritorio ? "hidden lg:block" : "lg:hidden"}`}
      style={
        {
          left: `${((f.nx + 1) / 2) * 100}%`,
          top: `${((1 - f.ny) / 2) * 100}%`,
          "--tam": `${(f.diametroVh * 100).toFixed(2)}vh`,
          "--rot": `${((f.fase * 180) / Math.PI).toFixed(0)}deg`,
          "--d": `${-(40 + (i % 4) * 22)}px`,
          "--retraso": `${(0.15 + i * 0.07).toFixed(2)}s`,
          zIndex: Math.round(10 + f.z),
        } as React.CSSProperties
      }
    >
      <svg viewBox="-60 -60 120 120" width="100%" height="100%" className="florecer">
        <g>
          {Array.from({ length: f.petalos }, (_, k) => (
            <path
              key={`e${k}`}
              d={PETALO_SVG}
              fill={p.exterior}
              transform={`rotate(${(k * 360) / f.petalos}) translate(0 -${52 * apertura}) scale(0.52) translate(-50 0)`}
            />
          ))}
          {Array.from({ length: interiores }, (_, k) => (
            <path
              key={`i${k}`}
              d={PETALO_SVG}
              fill={p.interior}
              transform={`rotate(${180 / interiores + (k * 360) / interiores}) translate(0 -${30 * apertura}) scale(0.3) translate(-50 0)`}
            />
          ))}
          {Array.from({ length: 8 }, (_, k) => {
            const a = ((22.5 + k * 45) * Math.PI) / 180;
            return <circle key={`d${k}`} cx={Math.cos(a) * 55} cy={Math.sin(a) * 55} r="2.6" fill={p.puntos} />;
          })}
          <circle r="5" fill={p.centro} />
        </g>
      </svg>
    </div>
  );
}

export function FlowerFallback({ oculto }: { oculto: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-luxe"
      style={{ opacity: oculto ? 0 : 1, visibility: oculto ? "hidden" : "visible", transitionProperty: "opacity, visibility" }}
    >
      {ESCRITORIO.map((f, i) => (
        <Flor key={`e${i}`} f={f} i={i} escritorio />
      ))}
      {MOVIL.map((f, i) => (
        <Flor key={`m${i}`} f={f} i={i} escritorio={false} />
      ))}
    </div>
  );
}
