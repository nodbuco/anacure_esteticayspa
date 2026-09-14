/**
 * Datos compartidos por el fondo 3D (three.js) y el fondo 2D (SVG).
 * Este archivo NO importa three.js: lo usa el bundle inicial.
 */

/** Silueta de hoja del isotipo en SVG (caja 100×100, base en 50,100, punta en 50,0). */
export const PETALO_SVG = "M50 100 C 24 78, 24 22, 50 0 C 76 22, 76 78, 50 100 Z";

/* Colores del kit y derivados. */
export const COLORES = {
  purpura: "#8323AB",
  lila400: "#C197D8",
  lila300: "#DAC0E8",
  lila200: "#EBDDF3",
  lila100: "#F5EEF9",
  verde: "#147B80",
  menta200: "#D4E4E5",
  menta100: "#E9F1F2",
  ciruela: "#561D87",
  indigo: "#252474",
  fondo: "#FAF7FC",
} as const;

export interface PaletaFlor {
  /** Corona exterior de pétalos */
  exterior: string;
  /** Corona interior, más pequeña */
  interior: string;
  /** Punto central */
  centro: string;
  /** Los ocho puntos que rematan la corona (como en el isotipo) */
  puntos: string;
}

export const PALETAS: PaletaFlor[] = [
  { exterior: COLORES.purpura, interior: COLORES.lila300, centro: COLORES.ciruela, puntos: COLORES.ciruela },
  { exterior: COLORES.lila400, interior: COLORES.lila100, centro: COLORES.purpura, puntos: COLORES.ciruela },
  { exterior: COLORES.verde, interior: COLORES.menta200, centro: COLORES.ciruela, puntos: COLORES.verde },
  { exterior: COLORES.lila300, interior: COLORES.lila100, centro: COLORES.verde, puntos: COLORES.ciruela },
  { exterior: COLORES.ciruela, interior: COLORES.lila400, centro: COLORES.lila300, puntos: COLORES.ciruela },
  { exterior: COLORES.menta200, interior: COLORES.menta100, centro: COLORES.verde, puntos: COLORES.verde },
];

/** Cámara del canvas: z = 10, fov 38°. Altura visible en z = 0 en unidades de mundo. */
export const CAMARA_Z = 10;
export const ALTO_VISIBLE_0 = 2 * CAMARA_Z * Math.tan((38 / 2) * (Math.PI / 180));

export interface FlorBase {
  /** Posición normalizada en pantalla: -1..1 (x hacia la derecha, y hacia arriba) */
  nx: number;
  ny: number;
  /** Profundidad (0 = plano de referencia, negativo = más lejos) */
  z: number;
  /** Largo del pétalo exterior en unidades de mundo */
  escala: number;
  petalos: number;
  paleta: number;
  fase: number;
  /** Diámetro aparente como fracción de la altura del viewport */
  diametroVh: number;
}

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

type P = [number, number];
function bezier(p0: P, p1: P, p2: P, p3: P, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/**
 * Disposición de las flores: una guirnalda con intención, no un reparto al azar.
 *
 * Escritorio: un arco que nace pequeño abajo a la izquierda (detrás de los botones),
 * crece al rodear la foto y se recoge arriba a la derecha; más un trío en la esquina
 * superior derecha. Las flores alternan cerca/lejos para dar profundidad, y se
 * desplazan a un lado y otro del arco para que no formen una fila.
 *
 * Móvil: el arco recorre la parte superior de izquierda a derecha y baja por el
 * borde derecho, siempre fuera de la columna de texto.
 */
export function disposicion(movil: boolean): FlorBase[] {
  const rnd = crearAleatorio(movil ? 4111 : 2609);
  const flores: FlorBase[] = [];

  const arco: [P, P, P, P] = movil
    ? [[-0.95, 1.1], [-0.2, 1.15], [1.35, 0.9], [1.05, -0.75]]
    : [[-0.95, -1.05], [-0.15, -0.6], [0.55, -0.35], [1.12, 0.85]];
  const n = movil ? 8 : 10;
  const paletaSecuencia = [0, 1, 2, 3, 0, 5, 1, 4, 2, 0, 3, 1];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const [cx, cy] = bezier(...arco, t);
    // Zigzag perpendicular al arco, alternando lados
    const lado = i % 2 === 0 ? 1 : -1;
    const nx = cx + lado * (movil ? 0.05 : 0.12) * (0.6 + 0.4 * Math.sin(i * 2.1)) + (rnd() - 0.5) * 0.05;
    const ny = cy + lado * (movil ? 0.07 : 0.1) * (0.5 + 0.5 * Math.cos(i * 1.7)) + (rnd() - 0.5) * 0.05;
    // Profundidad: cerca / lejos alternado con variación
    const z = -(i % 3 === 0 ? 0.6 : i % 3 === 1 ? 3.6 : 6.2) - rnd() * 0.8;
    // Tamaño: campana con máximo hacia el 55 % del arco (junto a la foto en escritorio)
    const campana = Math.exp(-Math.pow((t - (movil ? 0.45 : 0.58)) / 0.32, 2));
    const base = movil ? 0.075 + 0.11 * campana : 0.15 + 0.3 * campana;
    const factor = (CAMARA_Z - z) / CAMARA_Z;
    const escala = base * (1 + 0.5 * (-z / 7));
    flores.push({
      nx,
      ny,
      z,
      escala,
      petalos: 7 + (i % 3),
      paleta: paletaSecuencia[i % paletaSecuencia.length],
      fase: rnd() * Math.PI * 2,
      diametroVh: (2 * escala) / (ALTO_VISIBLE_0 * factor),
    });
  }

  if (!movil) {
    // Trío de la esquina superior derecha
    const esquina: Array<[number, number, number, number]> = [
      [0.86, 0.92, -1.2, 0.3],
      [1.02, 0.72, -3.4, 0.24],
      [0.72, 1.02, -5.6, 0.2],
    ];
    esquina.forEach(([nx, ny, z, base], k) => {
      const factor = (CAMARA_Z - z) / CAMARA_Z;
      const escala = base * (1 + 0.5 * (-z / 7));
      flores.push({ nx, ny, z, escala, petalos: 8, paleta: [1, 2, 3][k], fase: rnd() * Math.PI * 2, diametroVh: (2 * escala) / (ALTO_VISIBLE_0 * factor) });
    });
    // Acento pequeño junto al final del titular
    const z = -4.5;
    const escala = 0.12 * (1 + 0.5 * (-z / 7));
    flores.push({ nx: 0.12, ny: 0.86, z, escala, petalos: 7, paleta: 3, fase: 1.3, diametroVh: (2 * escala) / (ALTO_VISIBLE_0 * ((CAMARA_Z - z) / CAMARA_Z)) });
  } else {
    // Dos acentos pequeños en el borde derecho inferior (siguen visibles al empezar a bajar)
    [[1.0, -1.0, -2.5, 0.07], [0.9, -1.35, -5.0, 0.09]].forEach(([nx, ny, z, base], k) => {
      const factor = (CAMARA_Z - z) / CAMARA_Z;
      const escala = base * (1 + 0.5 * (-z / 7));
      flores.push({ nx, ny, z, escala, petalos: 7 + k, paleta: [2, 1][k], fase: rnd() * Math.PI * 2, diametroVh: (2 * escala) / (ALTO_VISIBLE_0 * factor) });
    });
  }
  return flores;
}
