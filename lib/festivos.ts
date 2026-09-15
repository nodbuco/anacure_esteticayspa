/**
 * Festivos de Colombia (Ley 51 de 1983, «Ley Emiliani»).
 *
 * Sin dependencias: la regla es fija y verificable. Tres grupos:
 * 1. Fijos: no se trasladan.
 * 2. Emiliani: si no caen en lunes, pasan al lunes siguiente.
 * 3. Relativos a la Pascua: Jueves y Viernes Santo se quedan; Ascensión,
 *    Corpus Christi y Sagrado Corazón se trasladan al lunes siguiente.
 *
 * Se usa en el servidor (bloqueos de la agenda) y en el navegador (calendario
 * del agendador), por eso no depende de la zona horaria: todo en fechas puras.
 */

export interface Festivo {
  /** AAAA-MM-DD */
  fecha: string;
  nombre: string;
}

const FIJOS: Array<[mes: number, dia: number, nombre: string]> = [
  [1, 1, "Año Nuevo"],
  [5, 1, "Día del Trabajo"],
  [7, 20, "Día de la Independencia"],
  [8, 7, "Batalla de Boyacá"],
  [12, 8, "Inmaculada Concepción"],
  [12, 25, "Navidad"],
];

const EMILIANI: Array<[mes: number, dia: number, nombre: string]> = [
  [1, 6, "Reyes Magos"],
  [3, 19, "San José"],
  [6, 29, "San Pedro y San Pablo"],
  [8, 15, "Asunción de la Virgen"],
  [10, 12, "Día de la Raza"],
  [11, 1, "Todos los Santos"],
  [11, 11, "Independencia de Cartagena"],
];

const PASCUA: Array<[desplazamiento: number, traslada: boolean, nombre: string]> = [
  [-3, false, "Jueves Santo"],
  [-2, false, "Viernes Santo"],
  [39, true, "Ascensión del Señor"],
  [60, true, "Corpus Christi"],
  [68, true, "Sagrado Corazón de Jesús"],
];

/** Domingo de Pascua (algoritmo de Meeus/Jones/Butcher, calendario gregoriano). */
function domingoDePascua(anio: number): Date {
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getTime() + dias * 86_400_000);
}

/** Lleva la fecha al lunes siguiente si no es lunes. */
function alLunes(fecha: Date): Date {
  const diaSemana = fecha.getUTCDay(); // 0 domingo … 1 lunes
  if (diaSemana === 1) return fecha;
  const faltan = (8 - diaSemana) % 7;
  return sumarDias(fecha, faltan);
}

function aIso(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/** Los 18 festivos nacionales del año, ordenados por fecha. */
export function festivosDelAnio(anio: number): Festivo[] {
  const lista: Festivo[] = [];
  for (const [mes, dia, nombre] of FIJOS) {
    lista.push({ fecha: aIso(new Date(Date.UTC(anio, mes - 1, dia))), nombre });
  }
  for (const [mes, dia, nombre] of EMILIANI) {
    lista.push({ fecha: aIso(alLunes(new Date(Date.UTC(anio, mes - 1, dia)))), nombre });
  }
  const pascua = domingoDePascua(anio);
  for (const [desplazamiento, traslada, nombre] of PASCUA) {
    const base = sumarDias(pascua, desplazamiento);
    lista.push({ fecha: aIso(traslada ? alLunes(base) : base), nombre });
  }
  return lista.sort((x, y) => (x.fecha < y.fecha ? -1 : 1));
}

const cache = new Map<number, Map<string, string>>();

/** Nombre del festivo si la fecha (AAAA-MM-DD) es festivo nacional; si no, null. */
export function festivoEn(fecha: string): string | null {
  const anio = Number(fecha.slice(0, 4));
  let mapa = cache.get(anio);
  if (!mapa) {
    mapa = new Map(festivosDelAnio(anio).map((f) => [f.fecha, f.nombre]));
    cache.set(anio, mapa);
  }
  return mapa.get(fecha) ?? null;
}
