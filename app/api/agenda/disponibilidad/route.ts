import { NextResponse } from "next/server";
import { servicioPorSlug } from "@/data/servicios";
import { EsquemaDisponibilidad, fechaReservable } from "@/lib/agenda";
import { ErrorAgenda, horasDisponibles } from "@/lib/ea";
import { crearLimitador, ipCliente } from "@/lib/limite";

export const dynamic = "force-dynamic";

const SIN_CACHE = { "Cache-Control": "no-store" };

/* Cada consulta llega a Easy!Appointments, que corta las ráfagas: 60 consultas por IP al minuto. */
const limitado = crearLimitador(60, 60_000);

/**
 * GET /api/agenda/disponibilidad?sede=aguachica&servicio=hydrafacial&fecha=2026-09-21
 * → { horas: ["07:30", "08:00", …] }  (hora de Colombia)
 * El token de Easy!Appointments nunca sale del servidor.
 */
export async function GET(peticion: Request) {
  if (limitado(ipCliente(peticion))) {
    return NextResponse.json({ error: "Demasiadas consultas seguidas. Espera un momento y vuelve a intentarlo." }, { status: 429, headers: SIN_CACHE });
  }
  const url = new URL(peticion.url);
  const datos = EsquemaDisponibilidad.safeParse(Object.fromEntries(url.searchParams));
  if (!datos.success) {
    return NextResponse.json({ error: "Parámetros no válidos" }, { status: 400, headers: SIN_CACHE });
  }
  const { sede, servicio, fecha } = datos.data;

  const s = servicioPorSlug(servicio);
  if (!s || s.soloWhatsApp || !s.sedes.includes(sede)) {
    return NextResponse.json({ error: "Ese servicio no se reserva en línea en esa sede" }, { status: 404, headers: SIN_CACHE });
  }

  const dia = fechaReservable(fecha);
  if (!dia.ok) {
    return NextResponse.json({ horas: [], motivo: dia.motivo }, { headers: SIN_CACHE });
  }

  try {
    const horas = await horasDisponibles(sede, servicio, fecha);
    return NextResponse.json({ horas }, { headers: SIN_CACHE });
  } catch (error) {
    if (error instanceof ErrorAgenda) {
      return NextResponse.json({ error: error.message }, { status: error.estado, headers: SIN_CACHE });
    }
    console.error("[agenda] disponibilidad", error);
    return NextResponse.json({ error: "No pudimos consultar la agenda" }, { status: 500, headers: SIN_CACHE });
  }
}
