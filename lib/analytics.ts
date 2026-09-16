/**
 * Capa de analítica agnóstica.
 *
 * Todos los componentes llaman a `track(evento, props)`; ningún componente
 * conoce al proveedor. Para cambiar de Plausible a GA4 (o a cualquier otro)
 * solo se toca este archivo.
 *
 * - En desarrollo: escribe el evento en la consola.
 * - En producción: si el script de Plausible está cargado (window.plausible),
 *   lo envía; si no, no hace nada.
 */

export type EventoAnalitica =
  | "cta_whatsapp"
  | "cta_agendar"
  | "cita_completada"
  | "formulario_contacto"
  | "vista_servicio"
  | "sede_seleccionada"
  | "cupon_copiado";

export type PropsEvento = Record<string, string | number | boolean | undefined>;

type PropsLimpias = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (evento: string, opciones?: { props?: PropsLimpias }) => void;
  }
}

function limpiar(props: PropsEvento): PropsLimpias {
  const salida: PropsLimpias = {};
  for (const [clave, valor] of Object.entries(props)) {
    if (valor !== undefined) salida[clave] = valor;
  }
  return salida;
}

export function track(evento: EventoAnalitica, props: PropsEvento = {}): void {
  if (typeof window === "undefined") return;
  const limpias = limpiar(props);

  if (process.env.NODE_ENV !== "production") {
    console.log("[analítica]", evento, limpias);
    return;
  }

  // Plausible (activo solo si NEXT_PUBLIC_PLAUSIBLE_HOST está definido).
  window.plausible?.(evento, { props: limpias });

  // GA4, si algún día se cambia de proveedor:
  // window.gtag?.("event", evento, limpias);
}
