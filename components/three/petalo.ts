/** La misma silueta en SVG (caja 100×100, base en 50,100, punta en 50,0) para el fondo 2D. */
export const PETALO_SVG = "M50 100 C 24 78, 24 22, 50 0 C 76 22, 76 78, 50 100 Z";

/* Colores del kit y derivados, compartidos por el 3D y el fondo 2D. */
export const COLORES = {
  purpura: "#8323AB",
  lila400: "#C197D8",
  lila300: "#DAC0E8",
  verde: "#147B80",
  menta200: "#D4E4E5",
  ciruela: "#561D87",
  indigo: "#252474",
  fondo: "#FAF7FC",
} as const;

export interface PaletaFlor {
  petalo: string;
  centro: string;
  peso: number;
}

export const PALETA: PaletaFlor[] = [
  { petalo: COLORES.purpura, centro: COLORES.lila300, peso: 3 },
  { petalo: COLORES.lila400, centro: COLORES.ciruela, peso: 3 },
  { petalo: COLORES.lila300, centro: COLORES.purpura, peso: 2 },
  { petalo: COLORES.verde, centro: COLORES.menta200, peso: 2 },
  { petalo: COLORES.menta200, centro: COLORES.verde, peso: 2 },
  { petalo: COLORES.ciruela, centro: COLORES.lila300, peso: 1 },
];

/** Generador determinista (mulberry32): mismas flores en cada carga. */
export function crearAleatorio(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function elegirPaleta(rnd: () => number): PaletaFlor {
  const total = PALETA.reduce((s, p) => s + p.peso, 0);
  let r = rnd() * total;
  for (const p of PALETA) {
    r -= p.peso;
    if (r <= 0) return p;
  }
  return PALETA[0];
}
