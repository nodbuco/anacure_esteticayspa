/**
 * Freno sencillo contra abuso en las rutas de la agenda, en memoria del proceso.
 * Suficiente con un solo contenedor; con varias réplicas habría que moverlo a Redis.
 */

/**
 * IP del visitante detrás de Traefik (Coolify). Traefik escribe `X-Real-Ip` con la IP que ve.
 * De `X-Forwarded-For` se toma la última entrada, la que añade el proxy: las anteriores
 * las puede escribir el propio cliente para esquivar el límite.
 */
export function ipCliente(peticion: Request): string {
  const real = peticion.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const cadena = peticion.headers.get("x-forwarded-for")?.split(",").map((parte) => parte.trim()).filter(Boolean) ?? [];
  return cadena.at(-1) ?? "local";
}

/** Tope de claves en memoria: si se supera, se vacía el registro para no crecer sin límite. */
const MAX_CLAVES = 5000;

/** Devuelve una función que responde `true` cuando la clave supera `max` usos dentro de `ventanaMs`. */
export function crearLimitador(max: number, ventanaMs: number): (clave: string) => boolean {
  const usos = new Map<string, number[]>();
  return (clave) => {
    const ahora = Date.now();
    const recientes = (usos.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
    recientes.push(ahora);
    usos.set(clave, recientes);
    if (usos.size > MAX_CLAVES) usos.clear();
    return recientes.length > max;
  };
}
