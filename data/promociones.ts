/**
 * Promoción de la barra que va bajo la cabecera, en todo el sitio.
 *
 * Para cambiarla, edita PROMOCION. Para quitarla antes de tiempo, pon `activa: false`.
 * Cuando llega `termina` la barra desaparece sola en el navegador; en el siguiente
 * despliegue deja de venir en el HTML.
 */
export interface Promocion {
  /** Identificador para la analítica */
  id: string;
  activa: boolean;
  /** Ocasión, en pocas palabras */
  ocasion: string;
  descuento: string;
  tratamiento: string;
  cupon: string;
  /** Fin de la promoción (ISO 8601 con la zona horaria de Colombia) */
  termina: string;
}

export const PROMOCION: Promocion = {
  id: "amor-y-amistad-2026",
  activa: true,
  ocasion: "Amor y amistad",
  descuento: "20 %",
  tratamiento: "Paquete Corporal Completo",
  cupon: "ANACUREWEB",
  // Se acaba con septiembre: medianoche del 1 de octubre en Colombia.
  termina: "2026-10-01T00:00:00-05:00",
};

/** La promoción si sigue vigente; si no, null. */
export function promocionVigente(ahora: number = Date.now()): Promocion | null {
  return PROMOCION.activa && ahora < Date.parse(PROMOCION.termina) ? PROMOCION : null;
}
