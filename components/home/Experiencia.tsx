"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha, IconoPausa, IconoReproducir } from "@/components/ui/Icons";
import { EXPERIENCIA } from "@/data/home";
import { cn } from "@/lib/cn";
import { escena } from "@/lib/escenas";

/** Tiempo de cada momento cuando el recorrido avanza solo. */
const DURACION_MS = 7000;
const TOTAL = EXPERIENCIA.length;
const MENOS_MOVIMIENTO = "(prefers-reduced-motion: reduce)";

/** Avisa al fondo 3D para que las flores se abran un instante. */
function pulsar() {
  escena.pulso = performance.now();
  escena.invalidar?.();
}

function suscribirMovimiento(avisar: () => void) {
  const consulta = window.matchMedia(MENOS_MOVIMIENTO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}

type Grupo = "movil" | "escritorio";
type EstadoSegmento = "lleno" | "en-curso" | "vacio";

/** Segmento de la barra de progreso: ya visto, el actual avanzando, o por venir. */
function estadoSegmento(i: number, activo: number, autoplay: boolean): EstadoSegmento {
  if (i < activo) return "lleno";
  if (i > activo) return "vacio";
  return autoplay ? "en-curso" : "lleno";
}

/** Círculo numerado de la línea de tiempo: actual, ya visto o pendiente. */
function claseNodo(es: boolean, visto: boolean): string {
  if (es) return "scale-110 border-purpura bg-purpura text-blanco shadow-float";
  if (visto) return "border-lila-300 bg-lila-100 text-purpura group-hover:border-purpura";
  return "border-linea bg-blanco text-gris group-hover:border-lila-400 group-hover:text-purpura";
}

/**
 * La experiencia: seis momentos como un recorrido guiado.
 *
 * - Avanza solo (7 s por momento) mientras la sección está a la vista, con una barra de progreso
 *   tipo «historias» sobre la foto. Se detiene mientras el ratón está sobre la lista de momentos.
 * - Se navega tocando un momento, con las flechas de la foto, deslizando la foto en el móvil o con
 *   las teclas de flecha. Elegir a mano pausa el recorrido; el botón de reproducir lo reanuda.
 * - Cada momento ofrece una acción concreta (agendar, ver el tratamiento, conocer al equipo).
 * - Con «reducir movimiento» no avanza solo.
 */
export function Experiencia() {
  const [activo, setActivo] = useState(0);
  const [detenido, setDetenido] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [leyendo, setLeyendo] = useState(false);
  const menosMovimiento = useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(MENOS_MOVIMIENTO).matches,
    () => true,
  );

  const raiz = useRef<HTMLElement>(null);
  const fila = useRef<HTMLOListElement>(null);
  const tabs = useRef<Record<Grupo, Array<HTMLButtonElement | null>>>({ movil: [], escritorio: [] });
  const toque = useRef<{ x: number; y: number } | null>(null);

  const autoplay = !detenido && !menosMovimiento;
  const corriendo = autoplay && enVista && !leyendo;
  const paso = EXPERIENCIA[activo];

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.35 });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // En el móvil, la pestaña activa se centra en su fila (sin mover la página en vertical).
  useEffect(() => {
    const contenedor = fila.current;
    const tab = tabs.current.movil[activo];
    if (!contenedor || !tab || contenedor.scrollWidth <= contenedor.clientWidth) return;
    contenedor.scrollTo({
      left: tab.offsetLeft - (contenedor.clientWidth - tab.offsetWidth) / 2,
      behavior: menosMovimiento ? "auto" : "smooth",
    });
  }, [activo, menosMovimiento]);

  const ir = (indice: number, enfocar?: Grupo) => {
    const destino = (indice + TOTAL) % TOTAL;
    setActivo(destino);
    setDetenido(true);
    pulsar();
    if (enfocar) tabs.current[enfocar][destino]?.focus();
  };

  const alTeclear = (e: React.KeyboardEvent, i: number, grupo: Grupo) => {
    const destinos: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: TOTAL - 1 };
    if (!(e.key in destinos)) return;
    e.preventDefault();
    ir(destinos[e.key], grupo);
  };

  const alTocar = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") toque.current = { x: e.clientX, y: e.clientY };
  };
  const alSoltar = (e: React.PointerEvent) => {
    const inicio = toque.current;
    toque.current = null;
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) ir(activo + (dx < 0 ? 1 : -1));
  };

  return (
    <section ref={raiz} id="experiencia" data-scene="experiencia" className="relative z-10 bg-blanco py-section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_90%_10%,rgb(245_238_249/0.9),transparent_65%)]" />
      <Container className="relative">
        <div className="revelar max-w-2xl">
          <Eyebrow>La experiencia</Eyebrow>
          <Heading tamano="lg" className="mt-4">
            Así se siente venir a Ana Cure
          </Heading>
          <p className="prosa mt-4 text-lead text-gris">Un recorrido en seis momentos. Elige uno o déjate llevar.</p>
        </div>

        <div className="revelar mt-10 grid gap-5 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          {/* Momentos · móvil: fila deslizable de pestañas */}
          <ol
            ref={fila}
            role="tablist"
            aria-label="Momentos de la experiencia"
            className="relative -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden"
          >
            {EXPERIENCIA.map((p, i) => {
              const es = i === activo;
              return (
                <li key={p.slug} role="presentation" className="shrink-0 snap-center">
                  <button
                    ref={(el) => {
                      tabs.current.movil[i] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={es}
                    aria-controls="experiencia-foto"
                    tabIndex={es ? 0 : -1}
                    onClick={() => ir(i)}
                    onKeyDown={(e) => alTeclear(e, i, "movil")}
                    className={cn(
                      "flex items-center gap-2 rounded-pill border py-1.5 pl-1.5 pr-4 text-sm transition-[background-color,border-color,color,box-shadow] duration-300 ease-luxe",
                      es ? "border-purpura bg-purpura text-blanco shadow-soft" : "border-linea bg-blanco text-tinta-suave",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-7 items-center justify-center rounded-full text-[0.72rem] font-semibold tabular-nums",
                        es ? "bg-blanco/20 text-blanco" : "bg-lila-100 text-purpura",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="whitespace-nowrap font-medium">{p.titulo}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Foto: progreso, controles y deslizamiento */}
          <div
            id="experiencia-foto"
            role="tabpanel"
            aria-label={`${paso.numero}. ${paso.titulo}`}
            onPointerDown={alTocar}
            onPointerUp={alSoltar}
            onPointerCancel={() => {
              toque.current = null;
            }}
            className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-[2rem] bg-lila-100 shadow-soft sm:aspect-[16/10] lg:order-2 lg:aspect-auto lg:h-[min(66svh,38rem)]"
          >
            {EXPERIENCIA.map((p, i) => (
              <div
                key={p.slug}
                aria-hidden={i !== activo}
                className={cn("absolute inset-0 transition-opacity duration-700 ease-luxe", i === activo ? "opacity-100" : "opacity-0")}
              >
                <Image
                  src={p.imagen}
                  alt={p.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 42rem, 92vw"
                  className={cn("object-cover transition-transform duration-[1600ms] ease-luxe", i === activo ? "scale-100" : "scale-[1.06]")}
                />
              </div>
            ))}

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-noche-ciruela/50 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-noche-ciruela/80 to-transparent" />

            {/* Progreso tipo «historias» */}
            <div aria-hidden="true" className="absolute inset-x-5 top-5 flex gap-1.5 sm:inset-x-6">
              {EXPERIENCIA.map((p, i) => {
                const estado = estadoSegmento(i, activo, autoplay);
                return (
                  <span key={p.slug} className="h-[3px] flex-1 overflow-hidden rounded-full bg-blanco/30">
                    {estado === "lleno" && <span className="block size-full rounded-full bg-blanco" />}
                    {estado === "en-curso" && (
                      <span
                        key={activo}
                        className="experiencia-progreso block size-full rounded-full bg-blanco"
                        style={{ animationDuration: `${DURACION_MS}ms`, animationPlayState: corriendo ? "running" : "paused" }}
                        onAnimationEnd={() => setActivo((a) => (a + 1) % TOTAL)}
                      />
                    )}
                  </span>
                );
              })}
            </div>

            {!menosMovimiento && (
              <button
                type="button"
                onClick={() => setDetenido((d) => !d)}
                aria-label={autoplay ? "Pausar el recorrido" : "Reproducir el recorrido"}
                className="glass-oscuro absolute right-5 top-10 inline-flex size-9 items-center justify-center rounded-full text-blanco transition-transform duration-300 ease-luxe hover:scale-105 active:scale-95 sm:right-6"
              >
                {autoplay ? <IconoPausa className="size-4" /> : <IconoReproducir className="size-4" />}
              </button>
            )}

            {/* Leyenda del momento */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-28 px-6 pb-6 text-blanco sm:px-7 sm:pb-7">
              <div key={activo} className="entrada-aparecer">
                <p className="titular truncate text-[0.68rem] tracking-[0.22em] text-lila-300 sm:whitespace-normal">
                  {paso.numero} · {paso.detalle}
                </p>
                <p className="titular mt-1 text-display-sm sm:text-display-md">{paso.titulo}</p>
              </div>
            </div>

            {/* Anterior / siguiente */}
            <div className="absolute bottom-5 right-5 flex gap-2 sm:bottom-6 sm:right-6">
              <button
                type="button"
                onClick={() => ir(activo - 1)}
                aria-label="Momento anterior"
                className="glass-oscuro group/ant inline-flex size-11 items-center justify-center rounded-full text-blanco transition-transform duration-300 ease-luxe active:scale-95"
              >
                <IconoFlecha className="size-5 rotate-180 transition-transform duration-300 ease-luxe group-hover/ant:-translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => ir(activo + 1)}
                aria-label="Momento siguiente"
                className="glass-oscuro group/sig inline-flex size-11 items-center justify-center rounded-full text-blanco transition-transform duration-300 ease-luxe active:scale-95"
              >
                <IconoFlecha className="size-5 transition-transform duration-300 ease-luxe group-hover/sig:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Texto y acción del momento · móvil */}
          <div className="min-h-32 lg:hidden" aria-live={autoplay ? "off" : "polite"}>
            <div key={activo} className="entrada-aparecer">
              <p className="text-[0.95rem] leading-relaxed text-gris">{paso.texto}</p>
              <Link href={paso.accion.href} className="group/accion mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purpura">
                {paso.accion.etiqueta}
                <IconoFlecha className="size-4 transition-transform duration-300 ease-luxe group-hover/accion:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Momentos · escritorio: línea de tiempo */}
          <div
            className="hidden lg:order-1 lg:block"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setLeyendo(true);
            }}
            onPointerLeave={() => setLeyendo(false)}
          >
            <ol role="tablist" aria-label="Momentos de la experiencia" aria-orientation="vertical">
              {EXPERIENCIA.map((p, i) => {
                const es = i === activo;
                const visto = i < activo;
                return (
                  <li key={p.slug} role="presentation" className="relative pb-3 pl-16">
                    {i < TOTAL - 1 && (
                      <span aria-hidden="true" className="absolute bottom-1 left-[1.28rem] top-[3.1rem] w-px bg-linea">
                        <span className={cn("absolute inset-x-0 top-0 bg-purpura transition-[height] duration-700 ease-luxe", visto ? "h-full" : "h-0")} />
                      </span>
                    )}
                    <button
                      ref={(el) => {
                        tabs.current.escritorio[i] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={es}
                      aria-controls="experiencia-foto"
                      tabIndex={es ? 0 : -1}
                      onClick={() => ir(i)}
                      onKeyDown={(e) => alTeclear(e, i, "escritorio")}
                      className="group flex min-h-[2.6rem] w-full items-center text-left"
                    >
                      <span
                        className={cn(
                          "titular absolute left-0 top-0 inline-flex size-[2.6rem] items-center justify-center rounded-full border text-[0.72rem] tracking-[0.1em] transition-[background-color,border-color,color,box-shadow,scale] duration-500 ease-luxe",
                          claseNodo(es, visto),
                        )}
                      >
                        {p.numero}
                      </span>
                      <span className={cn("titular text-display-sm transition-colors duration-300", es ? "text-purpura" : "text-tinta-suave group-hover:text-purpura")}>
                        {p.titulo}
                      </span>
                    </button>
                    <div
                      inert={!es}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500 ease-luxe",
                        es ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pr-4 pt-1 text-[0.95rem] leading-relaxed text-gris">{p.texto}</p>
                        <Link href={p.accion.href} className="group/accion mb-3 mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purpura">
                          {p.accion.etiqueta}
                          <IconoFlecha className="size-4 transition-transform duration-300 ease-luxe group-hover/accion:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
