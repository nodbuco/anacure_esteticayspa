/**
 * Cliente de Easy!Appointments. SOLO SERVIDOR.
 *
 * El token EA_API_KEY da acceso total al sistema de citas, por eso este módulo importa
 * "server-only": si algún componente de cliente lo importara, el build fallaría.
 * Lo usan únicamente los Route Handlers de app/api/agenda/.
 */
import "server-only";
import mapa from "@/data/agenda.generated.json";
import type { SedeSlug } from "@/data/sedes";

const BASE = process.env.EA_BASE_URL;
const TOKEN = process.env.EA_API_KEY;

/** Error con código HTTP para responder al navegador sin filtrar detalles internos. */
export class ErrorAgenda extends Error {
  constructor(
    public estado: number,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ErrorAgenda";
  }
}

export interface ClienteEA {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
}

export interface CitaEA {
  id: number;
  hash: string;
  start: string;
  end: string;
  customerId: number;
  providerId: number;
  serviceId: number;
}

async function ea<T>(metodo: "GET" | "POST", ruta: string, cuerpo?: unknown): Promise<T> {
  if (!BASE || !TOKEN) throw new ErrorAgenda(503, "La agenda no está configurada en este servidor");
  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      method: metodo,
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", Accept: "application/json" },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
  } catch (error) {
    console.error("[agenda] sin respuesta de Easy!Appointments", error);
    throw new ErrorAgenda(503, "La agenda no responde en este momento");
  }
  const texto = await respuesta.text();
  if (!respuesta.ok) {
    console.error(`[agenda] ${metodo} ${ruta} → ${respuesta.status}`, texto.slice(0, 300));
    if (respuesta.status === 429) throw new ErrorAgenda(503, "La agenda está ocupada, inténtalo en un momento");
    throw new ErrorAgenda(502, "La agenda devolvió un error");
  }
  return (texto ? JSON.parse(texto) : null) as T;
}

/** Id del proveedor (calendario) de una sede. */
export function idProveedor(sede: SedeSlug): number {
  const id = mapa.proveedores[sede];
  if (!id || id < 0) throw new ErrorAgenda(500, `La sede ${sede} no tiene calendario. Corre npm run ea:setup.`);
  return id;
}

/** Id del servicio en Easy!Appointments a partir del slug del sitio. */
export function idServicio(slug: string): number {
  const id = (mapa.servicios as Record<string, number | undefined>)[slug];
  if (!id || id < 0) throw new ErrorAgenda(404, "Ese servicio no se puede reservar en línea");
  return id;
}

/** Horas libres ("07:30", "08:00"…) de un servicio en una sede y fecha, en hora de Colombia. */
export async function horasDisponibles(sede: SedeSlug, servicio: string, fecha: string): Promise<string[]> {
  const params = new URLSearchParams({ providerId: String(idProveedor(sede)), serviceId: String(idServicio(servicio)), date: fecha });
  const horas = await ea<string[]>("GET", `/availabilities?${params}`);
  return Array.isArray(horas) ? horas : [];
}

/** Busca un cliente por celular exacto (+57…). */
export async function buscarClientePorCelular(celular: string): Promise<ClienteEA | null> {
  const clientes = await ea<ClienteEA[]>("GET", `/customers?q=${encodeURIComponent(celular)}&length=20`);
  return clientes.find((c) => c.phone === celular) ?? null;
}

export async function crearCliente(datos: { nombre: string; apellido: string; celular: string; email?: string; ciudad: string; notas: string }): Promise<ClienteEA> {
  return ea<ClienteEA>("POST", "/customers", {
    firstName: datos.nombre,
    lastName: datos.apellido,
    email: datos.email || null,
    phone: datos.celular,
    city: datos.ciudad,
    timezone: "America/Bogota",
    language: "spanish",
    notes: datos.notas,
  });
}

export async function crearCita(datos: { sede: SedeSlug; servicio: string; clienteId: number; inicio: string; fin: string; ubicacion: string; notas: string }): Promise<CitaEA> {
  return ea<CitaEA>("POST", "/appointments", {
    start: datos.inicio,
    end: datos.fin,
    location: datos.ubicacion,
    notes: datos.notas,
    status: "Booked",
    customerId: datos.clienteId,
    providerId: idProveedor(datos.sede),
    serviceId: idServicio(datos.servicio),
  });
}
