"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useState } from "react";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { useSede } from "@/components/sede/SedeProvider";
import { Button } from "@/components/ui/Button";
import { Campo } from "@/components/ui/Campo";
import { IconoCalendario, IconoCheck, IconoExterno, IconoFlecha, IconoReloj, IconoUbicacion } from "@/components/ui/Icons";
import { LISTA_SEDES, SEDES, type Sede, type SedeSlug } from "@/data/sedes";
import type { CategoriaSlug } from "@/data/servicios";
import { track } from "@/lib/analytics";
import { type CitaCreada, type DiaAgenda, DIAS_CORTOS, diasDeAgenda, EsquemaCita, formatearFecha, formatearHora, MESES_CORTOS, ZONA_HORARIA } from "@/lib/agenda";
import { cn } from "@/lib/cn";

export interface ServicioAgendable {
  slug: string;
  nombre: string;
  duracionMin: number;
  categoria: CategoriaSlug;
  sedes: SedeSlug[];
  resumen: string;
}

interface Props {
  sedeInicial: SedeSlug | null;
  servicioInicial: string | null;
  servicios: ServicioAgendable[];
  categorias: Array<{ slug: CategoriaSlug; corto: string }>;
  /** Fecha de hoy en Colombia, calculada en el servidor */
  hoy: string;
}

/* ------------------------------------------------------------------ */
/* Estado                                                               */
/* ------------------------------------------------------------------ */

type Paso = 1 | 2 | 3 | 4 | 5;

interface Estado {
  paso: Paso;
  sede: SedeSlug | null;
  servicio: string | null;
  fecha: string | null;
  hora: string | null;
  cita: CitaCreada | null;
  nombre: string;
  aviso: string | null;
}

type Accion =
  | { tipo: "sede"; sede: SedeSlug; servicios: ServicioAgendable[] }
  | { tipo: "servicio"; servicio: string }
  | { tipo: "fecha"; fecha: string }
  | { tipo: "hora"; hora: string }
  | { tipo: "ir"; paso: Paso }
  | { tipo: "creada"; cita: CitaCreada; nombre: string }
  | { tipo: "aviso"; aviso: string | null }
  | { tipo: "otra" };

function reducir(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "sede": {
      const sigueValido = accion.servicios.some((s) => s.slug === estado.servicio && s.sedes.includes(accion.sede));
      return { ...estado, sede: accion.sede, servicio: sigueValido ? estado.servicio : null, fecha: null, hora: null, paso: 2, aviso: null };
    }
    case "servicio":
      return { ...estado, servicio: accion.servicio, hora: null };
    case "fecha":
      return { ...estado, fecha: accion.fecha, hora: null };
    case "hora":
      return { ...estado, hora: accion.hora, paso: 4, aviso: null };
    case "ir":
      return { ...estado, paso: accion.paso, aviso: null };
    case "creada":
      return { ...estado, cita: accion.cita, nombre: accion.nombre, paso: 5, aviso: null };
    case "aviso":
      return { ...estado, aviso: accion.aviso };
    case "otra":
      return { ...estado, servicio: null, fecha: null, hora: null, cita: null, nombre: "", paso: estado.sede ? 2 : 1, aviso: null };
  }
}

function estadoInicial({ sedeInicial, servicioInicial, servicios }: Props): Estado {
  const candidato = servicioInicial ? servicios.find((s) => s.slug === servicioInicial) : undefined;
  const servicio = candidato && (!sedeInicial || candidato.sedes.includes(sedeInicial)) ? candidato.slug : null;
  let paso: Paso = 1;
  if (sedeInicial) paso = servicio ? 3 : 2;
  return { paso, sede: sedeInicial, servicio, fecha: null, hora: null, cita: null, nombre: "", aviso: null };
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                 */
/* ------------------------------------------------------------------ */

export function Agendador(props: Props) {
  const { servicios, categorias, hoy } = props;
  const [estado, despachar] = useReducer(reducir, props, estadoInicial);
  const { elegirSede } = useSede();

  const sede = estado.sede ? SEDES[estado.sede] : null;
  const servicio = servicios.find((s) => s.slug === estado.servicio) ?? null;

  const elegir = (slug: SedeSlug) => {
    elegirSede(slug);
    despachar({ tipo: "sede", sede: slug, servicios });
  };

  if (estado.paso === 5 && estado.cita && sede && servicio) {
    return <PasoListo cita={estado.cita} sede={sede} servicio={servicio} nombre={estado.nombre} alRepetir={() => despachar({ tipo: "otra" })} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="min-w-0">
        <Pasos actual={estado.paso} sede={sede} servicio={servicio} fecha={estado.fecha} hora={estado.hora} alIr={(p) => despachar({ tipo: "ir", paso: p })} />

        {estado.aviso && (
          <p role="alert" className="mt-6 rounded-[1rem] border border-purpura/30 bg-lila-100 px-4 py-3 text-sm text-ciruela">
            {estado.aviso}
          </p>
        )}

        <div className="mt-6 rounded-card border border-linea bg-blanco p-5 shadow-soft sm:p-8">
          {estado.paso === 1 && <PasoSede actual={estado.sede} alElegir={elegir} />}
          {estado.paso === 2 && estado.sede && (
            <PasoServicio
              sede={estado.sede}
              servicios={servicios}
              categorias={categorias}
              actual={estado.servicio}
              alElegir={(slug) => despachar({ tipo: "servicio", servicio: slug })}
              alContinuar={() => despachar({ tipo: "ir", paso: 3 })}
            />
          )}
          {estado.paso === 3 && estado.sede && servicio && (
            <PasoFecha
              sede={estado.sede}
              servicio={servicio}
              hoy={hoy}
              fecha={estado.fecha}
              hora={estado.hora}
              alElegirFecha={(f) => despachar({ tipo: "fecha", fecha: f })}
              alElegirHora={(h) => despachar({ tipo: "hora", hora: h })}
            />
          )}
          {estado.paso === 4 && estado.sede && servicio && estado.fecha && estado.hora && (
            <PasoDatos
              sede={estado.sede}
              servicio={servicio}
              fecha={estado.fecha}
              hora={estado.hora}
              alCupoOcupado={(mensaje) => {
                despachar({ tipo: "ir", paso: 3 });
                despachar({ tipo: "aviso", aviso: mensaje });
              }}
              alCrear={(cita, nombre) => despachar({ tipo: "creada", cita, nombre })}
            />
          )}
        </div>
      </div>

      <Resumen sede={sede} servicio={servicio} fecha={estado.fecha} hora={estado.hora} paso={estado.paso} alIr={(p) => despachar({ tipo: "ir", paso: p })} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Indicador de pasos                                                   */
/* ------------------------------------------------------------------ */

const PASOS: Array<{ n: Paso; etiqueta: string }> = [
  { n: 1, etiqueta: "Sede" },
  { n: 2, etiqueta: "Tratamiento" },
  { n: 3, etiqueta: "Fecha y hora" },
  { n: 4, etiqueta: "Tus datos" },
];

type EstadoVisualPaso = "actual" | "hecho" | "pendiente";

const ESTILO_PASO: Record<EstadoVisualPaso, { boton: string; numero: string }> = {
  actual: { boton: "bg-purpura text-blanco shadow-soft", numero: "bg-blanco/20 text-blanco" },
  hecho: { boton: "bg-menta-100 text-verde-oscuro hover:bg-menta-200", numero: "bg-verde text-blanco" },
  pendiente: { boton: "text-gris", numero: "border border-linea bg-blanco text-gris" },
};

function estadoDePaso(esActual: boolean, hecho: boolean): EstadoVisualPaso {
  if (esActual) return "actual";
  return hecho ? "hecho" : "pendiente";
}

function Pasos({
  actual,
  sede,
  servicio,
  fecha,
  hora,
  alIr,
}: {
  actual: Paso;
  sede: Sede | null;
  servicio: ServicioAgendable | null;
  fecha: string | null;
  hora: string | null;
  alIr: (p: Paso) => void;
}) {
  const listo: Record<Paso, boolean> = { 1: Boolean(sede), 2: Boolean(servicio), 3: Boolean(fecha && hora), 4: false, 5: false };
  // Se puede volver a un paso anterior, o avanzar a uno cuyos requisitos ya están cumplidos.
  const alcanzable = (p: Paso) => p < actual || (p === 2 && listo[1]) || (p === 3 && listo[1] && listo[2]) || (p === 4 && listo[1] && listo[2] && listo[3]);

  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Pasos de la reserva">
      {PASOS.map((p, i) => {
        const esActual = p.n === actual;
        const hecho = listo[p.n] && !esActual;
        const puede = alcanzable(p.n) && !esActual;
        const estadoVisual = estadoDePaso(esActual, hecho);
        return (
          <li key={p.n} className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => puede && alIr(p.n)}
              disabled={!puede}
              aria-current={esActual ? "step" : undefined}
              className={cn(
                "group inline-flex items-center gap-2 rounded-pill py-1.5 pl-1.5 pr-3 text-sm transition-colors duration-300 disabled:cursor-default",
                ESTILO_PASO[estadoVisual].boton,
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-semibold",
                  ESTILO_PASO[estadoVisual].numero,
                )}
              >
                {hecho ? <IconoCheck className="size-3.5" /> : p.n}
              </span>
              <span className={cn("truncate", !esActual && "sr-only sm:not-sr-only")}>{p.etiqueta}</span>
            </button>
            {i < PASOS.length - 1 && <span aria-hidden className="h-px w-3 shrink-0 bg-linea sm:w-5" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 1 · Sede                                                        */
/* ------------------------------------------------------------------ */

function PasoSede({ actual, alElegir }: { actual: SedeSlug | null; alElegir: (s: SedeSlug) => void }) {
  const { sede: recordada } = useSede();
  const marcada = actual ?? recordada;
  return (
    <div>
      <TituloPaso titulo="¿En qué sede te atendemos?" texto="Cada sede tiene su propio calendario." />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {LISTA_SEDES.map((s) => {
          const activa = s.slug === marcada;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => alElegir(s.slug)}
              className={cn(
                "group flex min-h-32 flex-col items-start rounded-[1.1rem] border p-5 text-left transition-[border-color,background-color,transform] duration-300 ease-luxe hover:-translate-y-0.5",
                activa ? "border-purpura bg-lila-100" : "border-linea bg-blanco hover:border-purpura hover:bg-lila-50",
              )}
            >
              <span className="inline-flex items-center gap-2 text-verde">
                <IconoUbicacion className="size-4" />
                <span className="titular text-[0.68rem] tracking-[0.2em]">{s.departamento}</span>
              </span>
              <span className="titular mt-2 text-display-sm text-tinta group-hover:text-purpura">{s.nombre}</span>
              <span className="mt-1 text-sm text-gris">
                {s.direccion}
                {s.barrio ? `, ${s.barrio}` : ""}
              </span>
              {activa && <span className="mt-3 text-xs font-medium text-purpura">Tu sede habitual</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 2 · Tratamiento                                                 */
/* ------------------------------------------------------------------ */

function PasoServicio({
  sede,
  servicios,
  categorias,
  actual,
  alElegir,
  alContinuar,
}: {
  sede: SedeSlug;
  servicios: ServicioAgendable[];
  categorias: Array<{ slug: CategoriaSlug; corto: string }>;
  actual: string | null;
  alElegir: (slug: string) => void;
  alContinuar: () => void;
}) {
  const disponibles = useMemo(() => servicios.filter((s) => s.sedes.includes(sede)), [servicios, sede]);
  const conServicios = categorias.filter((c) => disponibles.some((s) => s.categoria === c.slug));
  const [categoria, setCategoria] = useState<CategoriaSlug>(() => disponibles.find((s) => s.slug === actual)?.categoria ?? "facial");
  const lista = disponibles.filter((s) => s.categoria === categoria);
  const elegido = disponibles.find((s) => s.slug === actual) ?? null;

  return (
    <div>
      <TituloPaso titulo="¿Qué te gustaría hacerte?" texto="Si es tu primera vez, empieza por la valoración: es sin costo y ahí definimos tu protocolo." />

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Categorías">
        {conServicios.map((c) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={c.slug === categoria}
            onClick={() => setCategoria(c.slug)}
            className={cn(
              "shrink-0 rounded-pill px-4 py-2 text-sm transition-colors duration-300",
              c.slug === categoria ? "bg-tinta text-blanco" : "bg-lila-100 text-tinta hover:bg-lila-200",
            )}
          >
            {c.corto}
          </button>
        ))}
      </div>

      <div role="radiogroup" aria-label="Tratamientos" className="mt-4 grid gap-2 sm:grid-cols-2">
        {lista.map((s) => {
          const activo = s.slug === actual;
          const recomendado = s.slug === "valoracion";
          return (
            <label
              key={s.slug}
              className={cn(
                "flex cursor-pointer flex-col rounded-[1rem] border p-4 transition-colors duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-purpura/20",
                activo ? "border-purpura bg-lila-100" : "border-linea bg-blanco hover:border-lila-400 hover:bg-lila-50",
              )}
            >
              <input type="radio" name="servicio" value={s.slug} checked={activo} onChange={() => alElegir(s.slug)} className="sr-only" />
              <span className="flex items-start justify-between gap-3">
                <span className="font-medium text-tinta">{s.nombre}</span>
                <span className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded-full border", activo ? "border-purpura bg-purpura text-blanco" : "border-linea bg-blanco")}>
                  {activo && <IconoCheck className="size-3" />}
                </span>
              </span>
              <span className="mt-1 line-clamp-2 text-sm text-gris">{s.resumen}</span>
              <span className="mt-2 inline-flex items-center gap-3 text-xs text-gris">
                <span className="inline-flex items-center gap-1">
                  <IconoReloj className="size-3.5" /> {s.duracionMin} min
                </span>
                {recomendado && <span className="rounded-pill bg-menta-100 px-2 py-0.5 font-medium text-verde-oscuro">Primera vez: empieza aquí</span>}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gris">{elegido ? `Elegiste: ${elegido.nombre}` : "Elige un tratamiento para continuar."}</p>
        <Button onClick={alContinuar} disabled={!elegido} className="w-full sm:w-auto">
          <span>Elegir fecha y hora</span>
          <IconoFlecha className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 3 · Fecha y hora                                                */
/* ------------------------------------------------------------------ */

/** Estilo de cada día del calendario: elegido, disponible o cerrado. */
function claseDia(activo: boolean, abierto: boolean): string {
  if (activo) return "border-purpura bg-purpura text-blanco";
  if (abierto) return "border-linea bg-blanco text-tinta hover:border-purpura hover:bg-lila-50";
  return "border-transparent bg-lila-50 text-gris-claro";
}

/** Texto bajo el número del día: festivo, cerrado (domingo) o el mes. */
function etiquetaDia(d: DiaAgenda, mes: number): string {
  if (d.festivo) return "festivo";
  if (!d.abierto) return "cerrado";
  return MESES_CORTOS[mes - 1];
}

interface ResultadoHoras {
  clave: string;
  horas?: string[];
  motivo?: string;
  error?: string;
}

function PasoFecha({
  sede,
  servicio,
  hoy,
  fecha,
  hora,
  alElegirFecha,
  alElegirHora,
}: {
  sede: SedeSlug;
  servicio: ServicioAgendable;
  hoy: string;
  fecha: string | null;
  hora: string | null;
  alElegirFecha: (f: string) => void;
  alElegirHora: (h: string) => void;
}) {
  const dias = useMemo(() => diasDeAgenda(hoy), [hoy]);
  const [resultado, setResultado] = useState<ResultadoHoras | null>(null);
  const [reintento, setReintento] = useState(0);
  const clave = fecha ? `${sede}|${servicio.slug}|${fecha}|${reintento}` : null;
  const cargando = Boolean(clave) && resultado?.clave !== clave;

  useEffect(() => {
    if (!clave || !fecha) return;
    const control = new AbortController();
    const params = new URLSearchParams({ sede, servicio: servicio.slug, fecha });
    const consultar = async () => {
      try {
        const r = await fetch(`/api/agenda/disponibilidad?${params}`, { signal: control.signal });
        const json = (await r.json().catch(() => ({}))) as { horas?: string[]; motivo?: string; error?: string };
        if (!r.ok) throw new Error(json.error ?? "No pudimos consultar la agenda");
        setResultado({ clave, horas: json.horas ?? [], motivo: json.motivo });
      } catch (e: unknown) {
        if (control.signal.aborted) return;
        setResultado({ clave, error: e instanceof Error ? e.message : "No pudimos consultar la agenda" });
      }
    };
    void consultar();
    return () => control.abort();
  }, [clave, sede, servicio.slug, fecha]);

  const horas = !cargando && resultado?.clave === clave ? (resultado.horas ?? []) : [];
  const manana = horas.filter((h) => h < "12:00");
  const tarde = horas.filter((h) => h >= "12:00");

  return (
    <div>
      <TituloPaso titulo="¿Cuándo te viene bien?" texto={`${servicio.nombre} · ${servicio.duracionMin} min · Sede ${SEDES[sede].nombre}. Horas de Colombia.`} />

      <div className="-mx-5 mt-6 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 [scrollbar-width:thin]" role="listbox" aria-label="Día">
        {dias.map((d) => {
          const [, m, dia] = d.fecha.split("-").map(Number);
          const activo = d.fecha === fecha;
          return (
            <button
              key={d.fecha}
              type="button"
              role="option"
              aria-selected={activo}
              disabled={!d.abierto}
              title={d.motivo}
              onClick={() => alElegirFecha(d.fecha)}
              className={cn(
                "flex min-w-[4.4rem] shrink-0 snap-start flex-col items-center rounded-[1rem] border px-2 py-2.5 transition-colors duration-200",
                claseDia(activo, d.abierto),
              )}
            >
              <span className="text-[0.68rem] uppercase tracking-[0.12em]">{DIAS_CORTOS[d.diaSemana]}</span>
              <span className={cn("titular mt-0.5 text-xl leading-none", !d.abierto && "line-through decoration-1")}>{dia}</span>
              <span className="mt-1 text-[0.68rem]">{etiquetaDia(d, m)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-40" aria-live="polite">
        {!fecha && <p className="text-sm text-gris">Elige un día para ver las horas libres.</p>}

        {fecha && cargando && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" aria-busy="true" aria-label="Buscando horas libres">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="h-11 animate-pulse rounded-[0.8rem] bg-lila-100" />
            ))}
          </div>
        )}

        {fecha && !cargando && resultado?.error && (
          <div className="rounded-[1rem] bg-lila-100 p-4 text-sm text-tinta">
            <p>{resultado.error}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variante="secundario" onClick={() => setReintento((n) => n + 1)}>
                Volver a intentar
              </Button>
              <WhatsAppButton sede={sede} ubicacion="agendar-error" servicio={servicio.nombre} variante="whatsapp">
                Agendar por WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        )}

        {fecha && !cargando && !resultado?.error && horas.length === 0 && (
          <div className="rounded-[1rem] bg-lila-100 p-4 text-sm text-tinta">
            <p>{resultado?.motivo ?? `No quedan cupos el ${formatearFecha(fecha)}. Prueba otro día o escríbenos y buscamos un espacio contigo.`}</p>
            <div className="mt-3">
              <WhatsAppButton sede={sede} ubicacion="agendar-sin-cupos" servicio={servicio.nombre} variante="whatsapp">
                Pedir cupo por WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        )}

        {fecha && !cargando && horas.length > 0 && (
          <div className="grid gap-5">
            <p className="text-sm text-gris">
              {horas.length} {horas.length === 1 ? "hora libre" : "horas libres"} el {formatearFecha(fecha)}.
            </p>
            {[
              ["Mañana", manana],
              ["Tarde", tarde],
            ].map(([titulo, lista]) =>
              (lista as string[]).length > 0 ? (
                <div key={titulo as string}>
                  <p className="titular text-eyebrow text-verde">{titulo}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" role="listbox" aria-label={`Horas de la ${(titulo as string).toLowerCase()}`}>
                    {(lista as string[]).map((h) => (
                      <button
                        key={h}
                        type="button"
                        role="option"
                        aria-selected={h === hora}
                        onClick={() => alElegirHora(h)}
                        className={cn(
                          "min-h-11 rounded-[0.8rem] border text-sm tabular-nums transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5",
                          h === hora ? "border-purpura bg-purpura text-blanco" : "border-linea bg-blanco text-tinta hover:border-purpura hover:bg-lila-50",
                        )}
                      >
                        {formatearHora(h)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 4 · Datos                                                       */
/* ------------------------------------------------------------------ */

function PasoDatos({
  sede,
  servicio,
  fecha,
  hora,
  alCupoOcupado,
  alCrear,
}: {
  sede: SedeSlug;
  servicio: ServicioAgendable;
  fecha: string;
  hora: string;
  alCupoOcupado: (mensaje: string) => void;
  alCrear: (cita: CitaCreada, nombre: string) => void;
}) {
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const alEnviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const bruto = {
      sede,
      servicio: servicio.slug,
      fecha,
      hora,
      nombre: fd.get("nombre"),
      apellido: fd.get("apellido"),
      whatsapp: fd.get("whatsapp"),
      email: fd.get("email"),
      notas: fd.get("notas"),
      acepta: fd.get("acepta") === "on",
    };
    const datos = EsquemaCita.safeParse(bruto);
    if (!datos.success) {
      const mapa: Record<string, string> = {};
      for (const p of datos.error.issues) {
        const campo = String(p.path[0] ?? "general");
        if (!mapa[campo]) mapa[campo] = p.message;
      }
      setErrores(mapa);
      setErrorGeneral(null);
      return;
    }

    setErrores({});
    setErrorGeneral(null);
    setEnviando(true);
    try {
      const r = await fetch("/api/agenda/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos.data),
      });
      const json = (await r.json().catch(() => ({}))) as Partial<CitaCreada> & { error?: string; campos?: Record<string, string>; codigo?: string };
      if (r.status === 409) {
        alCupoOcupado(json.error ?? "Ese cupo acaba de ocuparse. Elige otra hora.");
        return;
      }
      if (!r.ok || typeof json.id !== "number") {
        if (json.campos) setErrores(json.campos);
        setErrorGeneral(json.error ?? "No pudimos guardar la cita. Inténtalo de nuevo o escríbenos por WhatsApp.");
        return;
      }
      track("cita_completada", { sede, servicio: servicio.slug });
      alCrear(json as CitaCreada, datos.data.nombre);
    } catch {
      setErrorGeneral("Sin conexión con la agenda. Revisa tu internet o escríbenos por WhatsApp.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={alEnviar} noValidate>
      <TituloPaso titulo="Cuéntanos quién eres" texto={`${servicio.nombre}, ${formatearFecha(fecha)} a las ${formatearHora(hora)}, sede ${SEDES[sede].nombre}.`} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Nombre" nombre="nombre" autoComplete="given-name" required maxLength={60} error={errores.nombre} />
        <Campo etiqueta="Apellido" nombre="apellido" autoComplete="family-name" required maxLength={60} error={errores.apellido} />
        <Campo
          etiqueta="WhatsApp"
          nombre="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="300 123 4567"
          required
          ayuda="Te confirmamos la cita por este número."
          error={errores.whatsapp}
        />
        <Campo etiqueta="Correo" nombre="email" type="email" inputMode="email" autoComplete="email" opcional maxLength={120} error={errores.email} />
        <Campo etiqueta="¿Algo que debamos saber?" nombre="notas" multilinea opcional maxLength={500} className="sm:col-span-2" placeholder="Alergias, embarazo, tratamientos recientes, o lo que quieras contarnos." error={errores.notas} />
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-tinta">
        <input type="checkbox" name="acepta" className="mt-1 size-4 shrink-0 accent-purpura" />
        <span>
          Autorizo a Ana Cure Estética & Spa a guardar mis datos para gestionar esta cita, según su{" "}
          <Link href="/privacidad" className="text-purpura underline underline-offset-2" target="_blank">
            política de datos
          </Link>
          .
        </span>
      </label>
      {errores.acepta && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {errores.acepta}
        </p>
      )}

      {errorGeneral && (
        <div role="alert" className="mt-5 rounded-[1rem] bg-lila-100 p-4 text-sm text-tinta">
          <p>{errorGeneral}</p>
          <div className="mt-3">
            <WhatsAppButton sede={sede} ubicacion="agendar-error" servicio={servicio.nombre}>
              Agendar por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gris">Sin costo por reservar. Si necesitas cambiar la hora, escríbenos.</p>
        <Button type="submit" tamano="lg" disabled={enviando} className="w-full sm:w-auto">
          <IconoCalendario className="size-5" />
          <span>{enviando ? "Guardando tu cita…" : "Confirmar cita"}</span>
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 5 · Listo                                                       */
/* ------------------------------------------------------------------ */

function urlGoogleCalendar(cita: CitaCreada, servicio: ServicioAgendable, sede: Sede): string {
  const f = cita.fecha.replace(/-/g, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${servicio.nombre} · Ana Cure Spa ${sede.nombre}`,
    dates: `${f}T${cita.hora.replace(":", "")}00/${f}T${cita.horaFin.replace(":", "")}00`,
    ctz: ZONA_HORARIA,
    location: `${sede.direccion}${sede.barrio ? `, ${sede.barrio}` : ""}, ${sede.ciudad}`,
    details: `Cita en Ana Cure Estética & Spa, sede ${sede.nombre}. Llega 10 minutos antes. WhatsApp ${sede.whatsappBonito}.`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function PasoListo({ cita, sede, servicio, nombre, alRepetir }: { cita: CitaCreada; sede: Sede; servicio: ServicioAgendable; nombre: string; alRepetir: () => void }) {
  const mensaje = `Hola, acabo de agendar por la web: ${servicio.nombre} el ${formatearFecha(cita.fecha)} a las ${formatearHora(cita.hora)} en la sede ${sede.nombre}. Soy ${nombre}.`;
  return (
    <div className="mx-auto max-w-2xl rounded-card border border-linea bg-blanco p-6 text-center shadow-soft sm:p-10">
      <span className="florecer mx-auto inline-flex size-16 items-center justify-center rounded-full bg-menta-100 text-verde">
        <IconoCheck className="size-8" />
      </span>
      <p className="titular mt-6 text-eyebrow text-verde">Cita agendada</p>
      <h2 className="titular mt-2 text-display-md text-tinta">Te esperamos, {nombre}</h2>
      <p className="mt-3 text-gris">Tu cita quedó registrada en la agenda de la sede. Te confirmamos por WhatsApp.</p>

      <dl className="mt-8 grid gap-4 rounded-[1.1rem] bg-lila-50 p-5 text-left sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-gris">Tratamiento</dt>
          <dd className="mt-1 font-medium text-tinta">{servicio.nombre}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-gris">Cuándo</dt>
          <dd className="mt-1 font-medium text-tinta">
            {formatearFecha(cita.fecha)}
            <br />
            {formatearHora(cita.hora)} a {formatearHora(cita.horaFin)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-gris">Dónde</dt>
          <dd className="mt-1 font-medium text-tinta">
            Sede {sede.nombre}
            <br />
            <span className="font-normal text-gris">
              {sede.direccion}
              {sede.barrio ? `, ${sede.barrio}` : ""}
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <WhatsAppButton sede={sede.slug} ubicacion="cita-confirmada" mensaje={mensaje} tamano="lg">
          Confirmar por WhatsApp
        </WhatsAppButton>
        <Button href={urlGoogleCalendar(cita, servicio, sede)} externo variante="secundario" tamano="lg">
          <IconoCalendario className="size-5" />
          <span>Añadir a Google Calendar</span>
        </Button>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-center sm:gap-6">
        <a href={sede.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-purpura hover:underline">
          <IconoUbicacion className="size-4" /> Cómo llegar <IconoExterno className="size-3.5" />
        </a>
        <button type="button" onClick={alRepetir} className="text-gris hover:text-purpura">
          Agendar otra cita
        </button>
      </div>
      <p className="mt-8 text-xs text-gris">Llega 10 minutos antes. Si necesitas cambiar o cancelar, escríbenos por WhatsApp y lo ajustamos.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resumen lateral                                                      */
/* ------------------------------------------------------------------ */

function Resumen({
  sede,
  servicio,
  fecha,
  hora,
  paso,
  alIr,
}: {
  sede: Sede | null;
  servicio: ServicioAgendable | null;
  fecha: string | null;
  hora: string | null;
  paso: Paso;
  alIr: (p: Paso) => void;
}) {
  const filas: Array<{ etiqueta: string; valor: React.ReactNode; paso: Paso; icono: React.ReactNode }> = [
    { etiqueta: "Sede", valor: sede ? `${sede.nombre}, ${sede.departamento}` : null, paso: 1, icono: <IconoUbicacion className="size-4" /> },
    { etiqueta: "Tratamiento", valor: servicio ? `${servicio.nombre} · ${servicio.duracionMin} min` : null, paso: 2, icono: <IconoReloj className="size-4" /> },
    { etiqueta: "Cuándo", valor: fecha && hora ? `${formatearFecha(fecha)}, ${formatearHora(hora)}` : null, paso: 3, icono: <IconoCalendario className="size-4" /> },
  ];
  const hayAlgo = filas.some((f) => f.valor);

  return (
    <aside className={cn("lg:sticky lg:top-24", !hayAlgo && "hidden lg:block")}>
      <div className="rounded-card border border-linea bg-blanco p-5 shadow-soft sm:p-6">
        <p className="titular text-eyebrow text-verde">Tu cita</p>
        <ul className="mt-4 grid gap-3">
          {filas.map((f) => (
            <li key={f.etiqueta} className="flex items-start gap-3">
              <span className={cn("mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full", f.valor ? "bg-menta-100 text-verde" : "bg-lila-100 text-gris-claro")}>{f.icono}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs uppercase tracking-[0.12em] text-gris">{f.etiqueta}</span>
                <span className={cn("block text-sm", f.valor ? "text-tinta" : "text-gris italic")}>{f.valor ?? "Pendiente"}</span>
              </span>
              {f.valor && f.paso !== paso && (
                <button type="button" onClick={() => alIr(f.paso)} className="text-xs text-purpura hover:underline">
                  Cambiar
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-linea pt-4">
          <p className="text-xs text-gris">¿Prefieres que te agendemos nosotros?</p>
          <div className="mt-2">
            <WhatsAppButton sede={sede?.slug} ubicacion="agendar-aside" servicio={servicio?.nombre} variante="secundario" className="w-full">
              Escribir por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */

function TituloPaso({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div>
      <h2 className="titular text-display-sm text-tinta">{titulo}</h2>
      {texto && <p className="mt-2 text-sm text-gris">{texto}</p>}
    </div>
  );
}
