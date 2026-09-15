/**
 * Reglas de la agenda compartidas por el navegador y el servidor.
 * Fechas siempre como texto AAAA-MM-DD y horas como HH:MM, en hora de Colombia.
 */
import { z } from "zod";
import { festivoEn } from "./festivos";

export const ZONA_HORARIA = "America/Bogota";
/** Hasta cuántos días adelante se puede reservar desde la web. */
export const HORIZONTE_DIAS = 30;

const DIAS_LARGOS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Fecha de hoy en Colombia, independientemente de la zona horaria del dispositivo o del servidor. */
export function hoyEnColombia(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_HORARIA, year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora);
}

function aFechaUtc(fecha: string): Date {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d));
}

export function sumarDias(fecha: string, dias: number): string {
  return new Date(aFechaUtc(fecha).getTime() + dias * 86_400_000).toISOString().slice(0, 10);
}

/** 0 domingo … 6 sábado */
export function diaDeSemana(fecha: string): number {
  return aFechaUtc(fecha).getUTCDay();
}

export interface DiaAgenda {
  fecha: string;
  diaSemana: number;
  /** Nombre del festivo, si lo es */
  festivo: string | null;
  /** Se puede reservar ese día */
  abierto: boolean;
  /** Por qué no, en palabras */
  motivo?: string;
}

/** Estado de un día concreto: abierto, domingo o festivo. */
export function estadoDelDia(fecha: string): DiaAgenda {
  const diaSemana = diaDeSemana(fecha);
  const festivo = festivoEn(fecha);
  if (diaSemana === 0) return { fecha, diaSemana, festivo, abierto: false, motivo: "Los domingos no atendemos" };
  if (festivo) return { fecha, diaSemana, festivo, abierto: false, motivo: `Festivo: ${festivo}` };
  return { fecha, diaSemana, festivo, abierto: true };
}

/** Los próximos días del calendario (abiertos y cerrados, para pintarlos todos). */
export function diasDeAgenda(desde: string = hoyEnColombia(), cantidad: number = HORIZONTE_DIAS): DiaAgenda[] {
  return Array.from({ length: cantidad }, (_, i) => estadoDelDia(sumarDias(desde, i)));
}

/** Comprueba en el servidor que la fecha está dentro del horizonte y es un día abierto. */
export function fechaReservable(fecha: string, hoy: string = hoyEnColombia()): { ok: true } | { ok: false; motivo: string } {
  if (fecha < hoy) return { ok: false, motivo: "Esa fecha ya pasó" };
  if (fecha > sumarDias(hoy, HORIZONTE_DIAS - 1)) return { ok: false, motivo: `Solo se puede reservar con ${HORIZONTE_DIAS} días de anticipación` };
  const estado = estadoDelDia(fecha);
  if (!estado.abierto) return { ok: false, motivo: estado.motivo ?? "Ese día no atendemos" };
  return { ok: true };
}

/** "07:30" → "7:30 a. m." */
export function formatearHora(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** "2026-09-21" → "lunes 21 de septiembre" (o con año) */
export function formatearFecha(fecha: string, conAnio = false): string {
  const [a, m, d] = fecha.split("-").map(Number);
  const texto = `${DIAS_LARGOS[diaDeSemana(fecha)]} ${d} de ${MESES_LARGOS[m - 1]}`;
  return conAnio ? `${texto} de ${a}` : texto;
}

export function sumarMinutos(hhmm: string, minutos: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutos;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Celular colombiano en formato internacional: "300 123 4567", "+57 300…" o "57300…"
 * → "+573001234567". Devuelve null si no parece un celular de Colombia.
 */
export function normalizarCelular(entrada: string): string | null {
  const digitos = entrada.replace(/\D/g, "");
  const local = digitos.startsWith("57") && digitos.length === 12 ? digitos.slice(2) : digitos;
  if (!/^3\d{9}$/.test(local)) return null;
  return `+57${local}`;
}

/* ------------------------------------------------------------------ */
/* Validación (misma en el navegador y en el servidor)                  */
/* ------------------------------------------------------------------ */

const sede = z.enum(["el-banco", "aguachica"], { error: "Elige una sede" });
const slug = z.string().regex(/^[a-z0-9-]{2,80}$/, "Servicio no válido");
const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida");
const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora no válida");

export const EsquemaDisponibilidad = z.object({ sede, servicio: slug, fecha });

export const EsquemaCita = z.object({
  sede,
  servicio: slug,
  fecha,
  hora,
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(60, "Máximo 60 caracteres"),
  apellido: z.string().trim().min(2, "Escribe tu apellido").max(60, "Máximo 60 caracteres"),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => normalizarCelular(v) !== null, "Escribe un celular colombiano de 10 dígitos (empieza por 3)"),
  email: z.union([z.literal(""), z.email("Ese correo no parece válido").max(120)]).optional(),
  notas: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
  acepta: z.literal(true, { error: "Necesitamos tu autorización para guardar la cita" }),
});

export interface CitaCreada {
  id: number;
  sede: z.infer<typeof sede>;
  servicio: string;
  fecha: string;
  hora: string;
  horaFin: string;
}
