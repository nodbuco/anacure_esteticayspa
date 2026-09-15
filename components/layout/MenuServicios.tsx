"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { Container } from "@/components/ui/Container";
import { IconoChevron, IconoFlecha } from "@/components/ui/Icons";
import type { CategoriaMenu } from "@/data/servicios";
import { cn } from "@/lib/cn";

/** Espera al entrar (no se abre al cruzar el menú de paso) y al salir (da tiempo a bajar al panel). */
const ESPERA_ABRIR_MS = 90;
const ESPERA_CERRAR_MS = 240;

/**
 * «Servicios» en la cabecera de escritorio: una píldora que, al pasar el ratón, despliega hacia
 * abajo las cinco categorías con sus tratamientos principales y una tarjeta de valoración.
 *
 * - El texto «Servicios» sigue siendo un enlace a /servicios.
 * - El chevrón abre y cierra con clic o teclado (para pantallas táctiles y lectores de pantalla).
 * - Escape, clic fuera, sacar el foco o navegar lo cierran.
 * - La animación vive en `.menu-servicios` (globals.css) y respeta «reducir movimiento».
 */
export function MenuServicios({ categorias }: { categorias: CategoriaMenu[] }) {
  const pathname = usePathname();
  // Se guarda la ruta en la que se abrió: al navegar deja de coincidir y se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === pathname;

  const espera = useRef<number | undefined>(undefined);
  const zona = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const chevron = useRef<HTMLButtonElement>(null);

  const cancelarEspera = () => {
    window.clearTimeout(espera.current);
    espera.current = undefined;
  };
  const abrir = () => {
    cancelarEspera();
    setAbiertoEn(pathname);
  };
  const cerrar = () => {
    cancelarEspera();
    setAbiertoEn(null);
  };

  const alEntrar = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelarEspera();
    if (!abierto) espera.current = window.setTimeout(() => setAbiertoEn(pathname), ESPERA_ABRIR_MS);
  };
  const alSalir = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelarEspera();
    espera.current = window.setTimeout(() => setAbiertoEn(null), ESPERA_CERRAR_MS);
  };
  const alPerderFoco = (e: React.FocusEvent) => {
    const siguiente = e.relatedTarget as Node | null;
    if (!siguiente) return;
    if (zona.current?.contains(siguiente) || panel.current?.contains(siguiente)) return;
    cerrar();
  };

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbiertoEn(null);
      chevron.current?.focus();
    };
    const alPulsarFuera = (e: PointerEvent) => {
      const objetivo = e.target as Node;
      if (zona.current?.contains(objetivo) || panel.current?.contains(objetivo)) return;
      setAbiertoEn(null);
    };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, [abierto]);

  useEffect(() => {
    const temporizador = espera;
    return () => window.clearTimeout(temporizador.current);
  }, []);

  return (
    <>
      <div
        ref={zona}
        onPointerEnter={alEntrar}
        onPointerLeave={alSalir}
        onBlur={alPerderFoco}
        className={cn(
          "inline-flex items-center rounded-pill py-1 pl-4 pr-1 ring-1 ring-inset transition-[background-color,box-shadow] duration-300 ease-luxe",
          abierto ? "bg-lila-200 ring-lila-300" : "bg-lila-100 ring-lila-200 hover:bg-lila-200 hover:ring-lila-300",
        )}
      >
        <Link href="/servicios" onClick={cerrar} className="whitespace-nowrap text-[0.95rem] font-medium text-purpura">
          Servicios
        </Link>
        <button
          ref={chevron}
          type="button"
          onClick={() => (abierto ? cerrar() : abrir())}
          aria-expanded={abierto}
          aria-controls="menu-servicios"
          aria-label="Ver servicios por categoría"
          className="ml-1 inline-flex size-8 items-center justify-center rounded-full text-purpura transition-colors duration-300 hover:bg-blanco/80"
        >
          <IconoChevron className={cn("size-4 transition-transform duration-300 ease-luxe", abierto && "rotate-180")} />
        </button>
      </div>

      {/* Velo muy suave sobre la página mientras el menú está abierto */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full h-dvh bg-tinta/10 transition-opacity duration-300 ease-luxe",
          abierto ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        id="menu-servicios"
        ref={panel}
        data-abierto={abierto}
        inert={!abierto}
        onPointerEnter={alEntrar}
        onPointerLeave={alSalir}
        onBlur={alPerderFoco}
        className="menu-servicios absolute inset-x-0 top-full border-b border-linea bg-blanco"
      >
        <Container className="grid gap-7 pb-7 pt-9">
          <div className="grid grid-cols-5 gap-6">
            {categorias.map((c, i) => (
              <div key={c.slug} className="menu-col min-w-0" style={{ "--i": i } as React.CSSProperties}>
                <Link href={`/servicios#${c.slug}`} onClick={cerrar} className="titular text-eyebrow text-verde transition-colors duration-300 hover:text-purpura">
                  {c.corto}
                </Link>
                <ul className="mt-4 space-y-1">
                  {c.servicios.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/servicios/${s.slug}`}
                        onClick={cerrar}
                        className="block py-1 text-[0.9rem] leading-snug text-tinta-suave transition-[color,translate] duration-200 ease-luxe hover:translate-x-0.5 hover:text-purpura"
                      >
                        {s.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
                {c.total > c.servicios.length && (
                  <Link
                    href={`/servicios#${c.slug}`}
                    onClick={cerrar}
                    className="group/ver mt-3 inline-flex items-center gap-1 text-xs font-medium text-purpura"
                  >
                    Ver los {c.total}
                    <IconoFlecha className="size-3.5 transition-transform duration-300 ease-luxe group-hover/ver:translate-x-0.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div
            className="menu-col flex items-center justify-between gap-6 rounded-card bg-lila-50 px-6 py-4 ring-1 ring-inset ring-linea"
            style={{ "--i": categorias.length } as React.CSSProperties}
          >
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="titular text-eyebrow text-verde">¿Primera vez?</p>
              <p className="titular text-display-sm text-tinta">Valoración sin costo</p>
              <p className="text-sm text-gris">Presencial o virtual. De ahí sale tu protocolo.</p>
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <Link href="/servicios" onClick={cerrar} className="group/todos inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-purpura">
                Ver todos los servicios
                <IconoFlecha className="size-4 transition-transform duration-300 ease-luxe group-hover/todos:translate-x-0.5" />
              </Link>
              <AgendarButton servicio="valoracion" ubicacion="menu-servicios">
                Agendar valoración
              </AgendarButton>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
