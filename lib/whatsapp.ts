import { SEDES, type SedeSlug } from "@/data/sedes";

export interface OpcionesWhatsApp {
  /** Nombre del servicio o tratamiento de interés */
  servicio?: string;
  /** Mensaje completo personalizado (sustituye al generado) */
  mensaje?: string;
}

/** Texto que llega ya escrito al chat de WhatsApp de la sede. */
export function mensajeWhatsApp(sede: SedeSlug, opciones: OpcionesWhatsApp = {}): string {
  if (opciones.mensaje) return opciones.mensaje;
  const nombre = SEDES[sede].nombre;
  const partes = [`Hola, quiero agendar una valoración en Ana Cure Spa ${nombre}.`];
  if (opciones.servicio) partes.push(`Me interesa: ${opciones.servicio}.`);
  partes.push("Vengo desde la página web.");
  return partes.join(" ");
}

/** Enlace wa.me con el número de la sede y el mensaje prellenado. */
export function urlWhatsApp(sede: SedeSlug, opciones: OpcionesWhatsApp = {}): string {
  const numero = SEDES[sede].whatsapp;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajeWhatsApp(sede, opciones))}`;
}
