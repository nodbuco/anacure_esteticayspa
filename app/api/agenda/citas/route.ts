import { NextResponse } from "next/server";
import { SEDES } from "@/data/sedes";
import { servicioPorSlug } from "@/data/servicios";
import { type CitaCreada, EsquemaCita, fechaReservable, normalizarCelular, sumarMinutos } from "@/lib/agenda";
import { buscarClientePorCelular, crearCita, crearCliente, ErrorAgenda, horasDisponibles } from "@/lib/ea";

export const dynamic = "force-dynamic";

const SIN_CACHE = { "Cache-Control": "no-store" };

/* Freno sencillo contra abuso: 6 intentos por IP cada 10 minutos (en memoria del proceso). */
const VENTANA_MS = 10 * 60_000;
const MAX_INTENTOS = 6;
const intentos = new Map<string, number[]>();

function limitado(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  if (intentos.size > 5000) intentos.clear();
  return recientes.length > MAX_INTENTOS;
}

/**
 * POST /api/agenda/citas
 * Cuerpo: { sede, servicio, fecha, hora, nombre, apellido, whatsapp, email?, notas?, acepta: true }
 * Crea (o reutiliza) el cliente por celular y registra la cita en Easy!Appointments.
 */
export async function POST(peticion: Request) {
  const ip = peticion.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limitado(ip)) {
    return NextResponse.json({ error: "Demasiados intentos seguidos. Espera unos minutos o escríbenos por WhatsApp." }, { status: 429, headers: SIN_CACHE });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo no válido" }, { status: 400, headers: SIN_CACHE });
  }

  const datos = EsquemaCita.safeParse(cuerpo);
  if (!datos.success) {
    const campos: Record<string, string> = {};
    for (const problema of datos.error.issues) {
      const campo = String(problema.path[0] ?? "general");
      if (!campos[campo]) campos[campo] = problema.message;
    }
    return NextResponse.json({ error: "Revisa los datos marcados", campos }, { status: 400, headers: SIN_CACHE });
  }

  const d = datos.data;
  const servicio = servicioPorSlug(d.servicio);
  if (!servicio || servicio.soloWhatsApp || !servicio.sedes.includes(d.sede)) {
    return NextResponse.json({ error: "Ese servicio no se reserva en línea en esa sede" }, { status: 404, headers: SIN_CACHE });
  }
  const dia = fechaReservable(d.fecha);
  if (!dia.ok) {
    return NextResponse.json({ error: dia.motivo }, { status: 400, headers: SIN_CACHE });
  }

  const sede = SEDES[d.sede];
  const celular = normalizarCelular(d.whatsapp)!;

  try {
    // El cupo pudo ocuparse mientras la persona llenaba el formulario.
    const horas = await horasDisponibles(d.sede, d.servicio, d.fecha);
    if (!horas.includes(d.hora)) {
      return NextResponse.json({ error: "Ese cupo acaba de ocuparse. Elige otra hora.", codigo: "cupo_ocupado" }, { status: 409, headers: SIN_CACHE });
    }

    let cliente = await buscarClientePorCelular(celular);
    if (!cliente) {
      cliente = await crearCliente({
        nombre: d.nombre,
        apellido: d.apellido,
        celular,
        email: d.email || undefined,
        ciudad: sede.ciudad,
        notas: `Registrado desde anacure.co. Sede preferida: ${sede.nombre}.`,
      });
    }

    const horaFin = sumarMinutos(d.hora, servicio.duracionMin);
    const notas = [
      "Reservado desde anacure.co",
      `Sede: ${sede.nombre}`,
      `WhatsApp: ${celular}`,
      d.email ? `Correo: ${d.email}` : null,
      d.notas ? `Nota de la persona: ${d.notas}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const cita = await crearCita({
      sede: d.sede,
      servicio: d.servicio,
      clienteId: cliente.id,
      inicio: `${d.fecha} ${d.hora}:00`,
      fin: `${d.fecha} ${horaFin}:00`,
      ubicacion: `${sede.direccion}${sede.barrio ? `, ${sede.barrio}` : ""}, ${sede.ciudad}`,
      notas,
    });

    const respuesta: CitaCreada = { id: cita.id, sede: d.sede, servicio: d.servicio, fecha: d.fecha, hora: d.hora, horaFin };
    return NextResponse.json(respuesta, { status: 201, headers: SIN_CACHE });
  } catch (error) {
    if (error instanceof ErrorAgenda) {
      return NextResponse.json({ error: error.message }, { status: error.estado, headers: SIN_CACHE });
    }
    console.error("[agenda] crear cita", error);
    return NextResponse.json({ error: "No pudimos guardar la cita. Escríbenos por WhatsApp y la agendamos contigo." }, { status: 500, headers: SIN_CACHE });
  }
}
