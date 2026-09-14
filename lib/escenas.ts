/**
 * Puente entre el scroll (GSAP ScrollTrigger) y la escena 3D (React Three Fiber).
 *
 * ScrollTrigger ESCRIBE aquí en cada actualización de scroll; el bucle de render
 * del canvas LEE estos valores en cada fotograma. Nunca pasa por estado de React,
 * así que el scroll no provoca renders del árbol de componentes.
 */
export interface EstadoEscena {
  /** Índice de la sección [data-scene] activa */
  indice: number;
  /** Progreso 0–1 dentro de la sección activa */
  progreso: number;
  /** Progreso 0–1 de toda la página */
  global: number;
  /** Número de secciones con data-scene */
  total: number;
  /** Puntero normalizado (-1..1), solo con ratón */
  puntero: { x: number; y: number };
  /** false cuando el canvas no aporta nada (pie de página visible) */
  activo: boolean;
  /** Lo registra el canvas: pide un fotograma cuando está en modo «demand» */
  invalidar?: () => void;
  /** Marca de tiempo (performance.now) del último «pulso»: las flores florecen un instante */
  pulso?: number;
}

export const escena: EstadoEscena = {
  indice: 0,
  progreso: 0,
  global: 0,
  total: 1,
  puntero: { x: 0, y: 0 },
  activo: true,
};
