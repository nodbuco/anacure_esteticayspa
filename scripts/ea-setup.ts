/**
 * Configura Easy!Appointments a partir de los datos del sitio (data/servicios.ts y data/sedes.ts).
 *
 *   npm run ea:setup            aplica los cambios
 *   npm run ea:setup -- --ver   solo muestra lo que haría, sin tocar nada
 *
 * Es idempotente: se puede correr las veces que haga falta. Busca cada cosa por nombre
 * (categorías, servicios), por correo (proveedores) o por fecha (festivos); si existe la
 * actualiza y si no la crea. Nunca borra citas. Solo elimina el servicio «Service», la
 * proveedora «Jane Doe» y el cliente «James Doe» de ejemplo, y únicamente si el sistema no tiene ninguna cita.
 *
 * Modelo: cada sede es un «proveedor» de Easy!Appointments con su propio calendario y
 * su propio horario. Al final escribe data/agenda.generated.json con los ids que el sitio
 * usa para consultar cupos y crear citas.
 *
 * Necesita EA_BASE_URL y EA_API_KEY en .env.local (el script se lanza con --env-file).
 */
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { HORARIO, LISTA_SEDES, type SedeSlug } from "../data/sedes";
import { CATEGORIAS, SERVICIOS, type CategoriaSlug } from "../data/servicios";
import { SITE } from "../data/site";
import { festivosDelAnio } from "../lib/festivos";

const BASE = process.env.EA_BASE_URL;
const TOKEN = process.env.EA_API_KEY;
const SOLO_VER = process.argv.includes("--ver");
const ANIOS_DE_FESTIVOS = 3;
const ZONA = "America/Bogota";
const DOMINIO_CORREO = "anacure.co";

if (!BASE || !TOKEN) {
  console.error("Faltan EA_BASE_URL o EA_API_KEY. Copia .env.example a .env.local y complétalo.");
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Cliente HTTP mínimo                                                  */
/* ------------------------------------------------------------------ */

type Metodo = "GET" | "POST" | "PUT" | "DELETE";

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ea<T>(metodo: Metodo, ruta: string, cuerpo?: unknown, intento = 1): Promise<T> {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", Accept: "application/json" },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  // El servidor limita las ráfagas de peticiones: se espera y se reintenta.
  if (respuesta.status === 429 && intento <= 6) {
    const segundos = Number(respuesta.headers.get("retry-after")) || 2 ** intento;
    console.log(`  … límite de peticiones; se reintenta en ${segundos} s`);
    await esperar(segundos * 1000);
    return ea<T>(metodo, ruta, cuerpo, intento + 1);
  }
  const texto = await respuesta.text();
  if (!respuesta.ok) {
    let mensaje = texto.slice(0, 300);
    try {
      mensaje = (JSON.parse(texto) as { message?: string }).message ?? mensaje;
    } catch {
      /* no era JSON */
    }
    throw new Error(`${metodo} ${ruta} → ${respuesta.status}: ${mensaje}`);
  }
  return (texto ? JSON.parse(texto) : null) as T;
}

/** Ejecuta la escritura, o solo la anuncia en modo --ver. */
async function escribir<T>(descripcion: string, metodo: Metodo, ruta: string, cuerpo?: unknown): Promise<T | null> {
  console.log(`  ${SOLO_VER ? "(ver)" : "→"} ${descripcion}`);
  if (SOLO_VER) return null;
  await esperar(250);
  return ea<T>(metodo, ruta, cuerpo);
}

const normalizar = (s: string) => s.trim().toLowerCase();

/* ------------------------------------------------------------------ */
/* Tipos de la API (solo lo que usamos)                                 */
/* ------------------------------------------------------------------ */

interface Ajuste {
  name: string;
  value: string;
}
interface Categoria {
  id: number;
  name: string;
}
interface Servicio {
  id: number;
  name: string;
}
interface Proveedor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  settings?: { username?: string };
}
interface Bloqueo {
  id: number;
  name: string;
  start: string;
  end: string;
}

/* ------------------------------------------------------------------ */
/* 1. Ajustes generales                                                 */
/* ------------------------------------------------------------------ */

type Tramo = { start: string; end: string; breaks: never[] } | null;

function planDeTrabajo(): Record<string, Tramo> {
  const plan: Record<string, Tramo> = { sunday: null };
  for (const tramo of HORARIO.estructurado) {
    for (const dia of tramo.dias) {
      plan[dia.toLowerCase()] = { start: tramo.abre, end: tramo.cierra, breaks: [] };
    }
  }
  return plan;
}

const AJUSTES: Record<string, string> = {
  company_name: SITE.nombre,
  company_link: SITE.url,
  company_working_plan: JSON.stringify(planDeTrabajo()),
  first_weekday: "monday",
  date_format: "DMY",
  time_format: "regular",
  // Minutos mínimos de anticipación para reservar un cupo.
  book_advance_timeout: "120",
  // En la página pública de Easy!Appointments hay que elegir sede (proveedor).
  display_any_provider: "0",
  // Formulario: nombre, apellido y WhatsApp obligatorios; correo opcional.
  require_first_name: "1",
  require_last_name: "1",
  display_email: "1",
  require_email: "0",
  display_phone_number: "1",
  require_phone_number: "1",
  display_address: "0",
  require_address: "0",
  display_city: "1",
  require_city: "0",
  display_zip_code: "0",
  require_zip_code: "0",
  display_notes: "1",
  require_notes: "0",
  // Habeas data: el cliente puede pedir que borren sus datos.
  display_delete_personal_information: "1",
};

async function configurarAjustes() {
  console.log("\n1. Ajustes generales");
  const actuales = await ea<Ajuste[]>("GET", "/settings?length=500");
  const mapa = new Map(actuales.map((a) => [a.name, a.value]));
  let cambios = 0;
  for (const [nombre, valor] of Object.entries(AJUSTES)) {
    if (mapa.get(nombre) === valor) continue;
    cambios++;
    await escribir(`ajuste ${nombre}`, "PUT", `/settings/${nombre}`, { value: valor });
  }
  if (cambios === 0) console.log("  sin cambios");
}

/* ------------------------------------------------------------------ */
/* 2. Categorías                                                        */
/* ------------------------------------------------------------------ */

async function configurarCategorias(): Promise<Record<CategoriaSlug, number>> {
  console.log("\n2. Categorías");
  const existentes = await ea<Categoria[]>("GET", "/service_categories?length=500");
  const ids = {} as Record<CategoriaSlug, number>;
  for (const c of CATEGORIAS) {
    const cuerpo = { name: c.eaNombre, description: c.descripcion };
    const previa = existentes.find((e) => normalizar(e.name) === normalizar(c.eaNombre));
    if (previa) {
      await escribir(`actualizar categoría «${c.eaNombre}» (#${previa.id})`, "PUT", `/service_categories/${previa.id}`, cuerpo);
      ids[c.slug] = previa.id;
    } else {
      const creada = await escribir<Categoria>(`crear categoría «${c.eaNombre}»`, "POST", "/service_categories", cuerpo);
      ids[c.slug] = creada?.id ?? -1;
    }
  }
  return ids;
}

/* ------------------------------------------------------------------ */
/* 3. Servicios                                                         */
/* ------------------------------------------------------------------ */

const COLOR_CATEGORIA: Record<CategoriaSlug, string> = {
  facial: "#8323AB",
  "medicina-estetica": "#561D87",
  corporal: "#252474",
  spa: "#147B80",
  belleza: "#C197D8",
};

async function configurarServicios(categorias: Record<CategoriaSlug, number>): Promise<Record<string, number>> {
  console.log("\n3. Servicios");
  const existentes = await ea<Servicio[]>("GET", "/services?length=500");
  const ids: Record<string, number> = {};
  for (const s of SERVICIOS) {
    const cuerpo = {
      name: s.nombre,
      duration: s.duracionMin,
      price: 0,
      currency: "COP",
      description: s.resumen,
      location: "",
      color: COLOR_CATEGORIA[s.categoria],
      availabilitiesType: "flexible",
      attendantsNumber: 1,
      // Los cupos se ofrecen cada 15 min en servicios cortos y cada 30 en el resto.
      slotInterval: s.duracionMin <= 30 ? 15 : 30,
      // Los servicios «solo por WhatsApp» existen para que el equipo los agende a mano,
      // pero no se ofrecen en la reserva pública.
      isPrivate: Boolean(s.soloWhatsApp),
      serviceCategoryId: categorias[s.categoria],
    };
    const previo = existentes.find((e) => normalizar(e.name) === normalizar(s.nombre));
    if (previo) {
      await escribir(`actualizar «${s.nombre}» (#${previo.id}, ${s.duracionMin} min)`, "PUT", `/services/${previo.id}`, cuerpo);
      ids[s.slug] = previo.id;
    } else {
      const creado = await escribir<Servicio>(`crear «${s.nombre}» (${s.duracionMin} min)`, "POST", "/services", cuerpo);
      ids[s.slug] = creado?.id ?? -1;
    }
  }
  return ids;
}

/* ------------------------------------------------------------------ */
/* 4. Proveedores (una por sede)                                        */
/* ------------------------------------------------------------------ */

function claveAleatoria(): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from(randomBytes(16), (b) => alfabeto[b % alfabeto.length]).join("");
}

async function configurarProveedores(servicios: Record<string, number>): Promise<Record<SedeSlug, number>> {
  console.log("\n4. Proveedores (una por sede)");
  const existentes = await ea<Proveedor[]>("GET", "/providers?length=500");
  const ids = {} as Record<SedeSlug, number>;
  const claves: Array<[string, string]> = [];

  for (const sede of LISTA_SEDES) {
    const correo = `${sede.slug}@${DOMINIO_CORREO}`;
    const usuario = sede.slug.replace("-", "");
    const serviciosDeLaSede = SERVICIOS.filter((s) => s.sedes.includes(sede.slug))
      .map((s) => servicios[s.slug])
      .filter((id) => id > 0);

    const cuerpo: Record<string, unknown> = {
      firstName: "Ana Cure Spa",
      lastName: sede.nombre,
      email: correo,
      mobile: sede.telefonoInternacional,
      phone: sede.telefonoInternacional,
      address: sede.direccion + (sede.barrio ? `, ${sede.barrio}` : ""),
      city: sede.ciudad,
      state: sede.departamento,
      notes: `Sede ${sede.nombre}. Calendario creado desde el sitio web (scripts/ea-setup.ts).`,
      timezone: ZONA,
      language: "spanish",
      isPrivate: false,
      services: serviciosDeLaSede,
      settings: {
        username: usuario,
        notifications: true,
        calendarView: "default",
        googleSync: false,
        caldavSync: false,
        syncFutureDays: 90,
        syncPastDays: 30,
        workingPlan: planDeTrabajo(),
        workingPlanExceptions: {},
      },
    };

    const previo = existentes.find((p) => normalizar(p.email) === normalizar(correo));
    if (previo) {
      await escribir(`actualizar sede «${sede.nombre}» (#${previo.id}, ${serviciosDeLaSede.length} servicios)`, "PUT", `/providers/${previo.id}`, cuerpo);
      ids[sede.slug] = previo.id;
    } else {
      const clave = claveAleatoria();
      (cuerpo.settings as Record<string, unknown>).password = clave;
      const creado = await escribir<Proveedor>(`crear sede «${sede.nombre}» (${serviciosDeLaSede.length} servicios)`, "POST", "/providers", cuerpo);
      ids[sede.slug] = creado?.id ?? -1;
      claves.push([usuario, clave]);
    }
  }

  if (claves.length > 0 && !SOLO_VER) {
    console.log("\n  Usuarios creados en Easy!Appointments (guárdalos y cámbialos desde el panel):");
    for (const [usuario, clave] of claves) console.log(`    usuario: ${usuario}   contraseña: ${clave}`);
  }
  return ids;
}

/* ------------------------------------------------------------------ */
/* 5. Festivos como periodos bloqueados                                 */
/* ------------------------------------------------------------------ */

async function configurarFestivos() {
  console.log("\n5. Festivos de Colombia (periodos bloqueados)");
  const existentes = await ea<Bloqueo[]>("GET", "/blocked_periods?length=1000");
  const porFecha = new Map(existentes.map((b) => [b.start.slice(0, 10), b]));
  const anioActual = new Date().getFullYear();
  let creados = 0;
  for (let anio = anioActual; anio < anioActual + ANIOS_DE_FESTIVOS; anio++) {
    for (const f of festivosDelAnio(anio)) {
      if (porFecha.has(f.fecha)) continue;
      creados++;
      await escribir(`bloquear ${f.fecha} · ${f.nombre}`, "POST", "/blocked_periods", {
        name: `Festivo · ${f.nombre}`,
        start: `${f.fecha} 00:00:00`,
        end: `${f.fecha} 23:59:59`,
        notes: "Festivo nacional (Ley 51 de 1983). Creado por scripts/ea-setup.ts.",
      });
    }
  }
  if (creados === 0) console.log("  todos los festivos ya estaban bloqueados");
}

/* ------------------------------------------------------------------ */
/* 6. Limpieza de los datos de ejemplo                                  */
/* ------------------------------------------------------------------ */

async function limpiarEjemplo() {
  console.log("\n6. Datos de ejemplo de la instalación");
  const citas = await ea<unknown[]>("GET", "/appointments?length=1");
  if (citas.length > 0) {
    console.log("  hay citas registradas: no se borra nada");
    return;
  }
  const servicios = await ea<Servicio[]>("GET", "/services?length=500");
  for (const s of servicios.filter((x) => x.name === "Service")) {
    await escribir(`borrar servicio de ejemplo «Service» (#${s.id})`, "DELETE", `/services/${s.id}`);
  }
  const proveedores = await ea<Proveedor[]>("GET", "/providers?length=500");
  for (const p of proveedores.filter((x) => x.email === "jane@example.org")) {
    await escribir(`borrar proveedora de ejemplo «Jane Doe» (#${p.id})`, "DELETE", `/providers/${p.id}`);
  }
  const clientes = await ea<Proveedor[]>("GET", "/customers?length=500");
  for (const c of clientes.filter((x) => x.email === "james@example.org")) {
    await escribir(`borrar cliente de ejemplo «James Doe» (#${c.id})`, "DELETE", `/customers/${c.id}`);
  }
}

/* ------------------------------------------------------------------ */
/* 7. Mapa de ids para el sitio                                         */
/* ------------------------------------------------------------------ */

function guardarMapa(proveedores: Record<SedeSlug, number>, servicios: Record<string, number>, categorias: Record<CategoriaSlug, number>) {
  const ruta = resolve(import.meta.dirname, "../data/agenda.generated.json");
  const contenido = {
    _comentario: "Generado por scripts/ea-setup.ts. No editar a mano: vuelve a correr `npm run ea:setup`.",
    generadoEn: new Date().toISOString(),
    servidor: new URL(BASE!).host,
    proveedores,
    servicios,
    categorias,
  };
  if (SOLO_VER) {
    console.log(`\n(ver) escribiría ${ruta}`);
    return;
  }
  writeFileSync(ruta, JSON.stringify(contenido, null, 2) + "\n");
  console.log(`\nMapa de ids escrito en ${ruta}`);
}

/* ------------------------------------------------------------------ */

async function principal() {
  console.log(`Easy!Appointments · ${new URL(BASE!).host}${SOLO_VER ? " · modo --ver (no cambia nada)" : ""}`);
  await configurarAjustes();
  const categorias = await configurarCategorias();
  const servicios = await configurarServicios(categorias);
  const proveedores = await configurarProveedores(servicios);
  await configurarFestivos();
  await limpiarEjemplo();
  guardarMapa(proveedores, servicios, categorias);
  console.log("\nListo.");
}

principal().catch((error: unknown) => {
  console.error("\nError:", error instanceof Error ? error.message : error);
  process.exit(1);
});
