"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { EXPERIENCIA } from "@/data/home";
import { escena } from "@/lib/escenas";
import { cn } from "@/lib/cn";

const INTERVALO = 6500;

/** Avisa al fondo 3D para que las flores se abran un instante. */
function pulsar() {
  escena.pulso = performance.now();
  escena.invalidar?.();
}

/**
 * Recorrido por el spa. Seis pasos con botones grandes; al elegir uno cambia la foto
 * y el texto, y las flores del fondo reciben un pulso. Avanza solo cada 6,5 s mientras
 * está a la vista y nadie lo ha tocado.
 */
export function Experiencia() {
  const [activo, setActivo] = useState(0);
  const [manual, setManual] = useState(false);
  const raiz = useRef<HTMLElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (manual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (visible.current) setActivo((a) => (a + 1) % EXPERIENCIA.length);
    }, INTERVALO);
    return () => window.clearInterval(t);
  }, [manual]);

  const elegir = (i: number) => {
    setActivo(i);
    setManual(true);
    pulsar();
  };

  const paso = EXPERIENCIA[activo];

  return (
    <section ref={raiz} id="experiencia" data-scene="experiencia" className="relative z-10 bg-blanco py-section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_90%_10%,rgb(245_238_249/0.9),transparent_65%)]" />
      <Container className="relative">
        <div className="revelar max-w-2xl">
          <Eyebrow>La experiencia</Eyebrow>
          <Heading tamano="lg" className="mt-4">
            Así se siente venir a Ana Cure
          </Heading>
          <p className="prosa mt-4 text-lead text-gris">Un recorrido en seis momentos. Toca cada paso.</p>
        </div>

        <div className="revelar mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Imagen */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-lila-100 shadow-soft lg:order-2 lg:aspect-[4/5]">
            {EXPERIENCIA.map((p, i) => (
              <div
                key={p.slug}
                aria-hidden={i !== activo}
                className={cn("absolute inset-0 transition-opacity duration-700 ease-luxe", i === activo ? "opacity-100" : "opacity-0")}
              >
                <Image src={p.imagen} alt={p.alt} fill sizes="(min-width: 1024px) 40rem, 92vw" className={cn("object-cover transition-transform duration-[1400ms] ease-luxe", i === activo ? "scale-100" : "scale-105")} />
              </div>
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche-ciruela/60 to-transparent px-6 pb-6 pt-16 text-blanco">
              <p className="titular text-[0.68rem] tracking-[0.22em] text-lila-300">{paso.numero} · {paso.detalle}</p>
              <p className="titular mt-1 text-display-sm">{paso.titulo}</p>
            </div>
          </div>

          {/* Pasos */}
          <ol className="flex snap-x gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:gap-2 lg:overflow-visible" aria-label="Momentos de la experiencia">
            {EXPERIENCIA.map((p, i) => {
              const es = i === activo;
              return (
                <li key={p.slug} className="min-w-[16rem] shrink-0 snap-start lg:min-w-0">
                  <button
                    type="button"
                    onClick={() => elegir(i)}
                    aria-current={es ? "step" : undefined}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ease-luxe lg:p-5",
                      es ? "border-purpura bg-lila-50 shadow-soft" : "border-linea bg-blanco/70 hover:border-lila-300 hover:bg-lila-50",
                    )}
                  >
                    <span className={cn("titular mt-0.5 text-[0.8rem] tracking-[0.15em]", es ? "text-purpura" : "text-gris")}>{p.numero}</span>
                    <span>
                      <span className={cn("titular block text-display-sm", es ? "text-tinta" : "text-tinta-suave")}>{p.titulo}</span>
                      <span className={cn("mt-1 block text-sm leading-relaxed text-gris transition-all duration-300", es ? "max-h-40 opacity-100" : "max-h-40 opacity-80 lg:max-h-0 lg:overflow-hidden lg:opacity-0")}>
                        {p.texto}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
