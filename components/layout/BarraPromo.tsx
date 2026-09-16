"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { IconoCopiar, IconoCorazon } from "@/components/ui/Icons";
import type { Promocion } from "@/data/promociones";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const MINUTO = 60_000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

/*
 * Reloj por minutos: la cuenta muestra días y horas, así que basta con mirar cada 15 s.
 * En el servidor y al hidratar no hay hora (null): la página es estática y la hora del build
 * quedaría vieja. La cuenta se completa en el navegador, en un hueco del mismo ancho.
 */
function suscribir(avisar: () => void) {
  const id = window.setInterval(avisar, 15_000);
  return () => window.clearInterval(id);
}
const minutoActual = () => Math.floor(Date.now() / MINUTO);
const sinHora = () => null;

const dosCifras = (n: number | null) => (n === null ? "––" : String(n).padStart(2, "0"));

function Unidad({ valor, etiqueta }: { valor: number | null; etiqueta: string }) {
  return (
    <span className="inline-flex min-w-[3.6rem] items-baseline justify-center gap-1 rounded-md bg-blanco/12 px-2 py-0.5 ring-1 ring-inset ring-blanco/15">
      <span className="text-[0.85rem] font-semibold tabular-nums">{dosCifras(valor)}</span>
      <span className="text-[0.68rem] text-lila-100">{etiqueta}</span>
    </span>
  );
}

/**
 * Barra de promoción bajo la cabecera, en todo el sitio salvo el editor del blog.
 * Se va con el scroll (no es fija) y desaparece sola cuando termina la promoción.
 * Su alto se publica en --alto-promo (globals.css): el hero lo descuenta para seguir
 * ocupando la primera pantalla igual que sin barra.
 */
export function BarraPromo({ promo }: { promo: Promocion }) {
  const ruta = usePathname();
  const minuto = useSyncExternalStore(suscribir, minutoActual, sinHora);
  const [copiado, setCopiado] = useState(false);

  const restante = minuto === null ? null : Date.parse(promo.termina) - minuto * MINUTO;
  if (ruta.startsWith("/keystatic") || (restante !== null && restante <= 0)) return null;

  const dias = restante === null ? null : Math.floor(restante / DIA);
  const horas = restante === null ? null : Math.floor((restante % DIA) / HORA);
  const ultimoDia = dias === 0;
  const rotulo = ultimoDia ? "Último día" : "Termina en";
  let paraLectores = "";
  if (dias !== null) {
    paraLectores = ultimoDia ? `Último día: quedan ${horas} horas.` : `Termina en ${dias} ${dias === 1 ? "día" : "días"} y ${horas} horas.`;
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(promo.cupon);
    } catch {
      return;
    }
    setCopiado(true);
    track("cupon_copiado", { promocion: promo.id, cupon: promo.cupon });
    window.setTimeout(() => setCopiado(false), 2200);
  };

  return (
    <aside id="barra-promo" aria-label={`Promoción de ${promo.ocasion.toLowerCase()}`} className="barra-promo relative z-20 overflow-hidden bg-[linear-gradient(100deg,var(--color-ciruela),var(--color-purpura)_55%,var(--color-ciruela))] text-blanco">
      <Container className="flex h-12 items-center justify-between gap-3 sm:h-11">
        <p className="min-w-0 text-[0.75rem] leading-[1.4] sm:text-[0.8125rem]">
          <span className="mr-3 hidden items-center gap-1.5 align-[0.05em] font-display text-[0.64rem] uppercase tracking-[0.2em] text-lila-200 lg:inline-flex">
            <IconoCorazon className="size-3" />
            {promo.ocasion}
          </span>
          <strong className="block font-semibold sm:inline">
            {promo.descuento}
            <span className="hidden xl:inline"> de descuento</span> en <span className="hidden md:inline">el </span>
            {promo.tratamiento}
          </strong>
          <span className="hidden xl:inline">. Reclámalo en cualquier sede</span>
          <span className="sm:hidden">Cupón </span>
          <span className="hidden sm:inline md:hidden"> · cupón </span>
          <span className="hidden md:inline"> con el cupón </span>
          <button
            type="button"
            onClick={copiar}
            aria-label={`Copiar el cupón ${promo.cupon}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-blanco/55 bg-blanco/10 px-2 py-0.5 align-[0.05em] font-semibold tracking-[0.06em] transition-colors sm:tracking-[0.12em] duration-300 hover:bg-blanco/20 focus-visible:outline-blanco"
          >
            <span className="grid">
              <span className={cn("col-start-1 row-start-1 transition-opacity duration-200", copiado && "opacity-0")}>{promo.cupon}</span>
              <span aria-hidden="true" className={cn("col-start-1 row-start-1 text-center tracking-normal opacity-0 transition-opacity duration-200", copiado && "opacity-100")}>
                ¡Copiado!
              </span>
            </span>
            <IconoCopiar className="size-3 opacity-80" />
          </button>
          <span className="hidden min-[420px]:inline sm:hidden"> · en ambas sedes</span>
          <span role="status" className="sr-only">
            {copiado ? "Cupón copiado" : ""}
          </span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <span className="sr-only">{paraLectores}</span>
          <span aria-hidden="true" className="flex flex-col items-end leading-[1.15] sm:hidden">
            <span className="text-[0.56rem] uppercase tracking-[0.16em] text-lila-200">{rotulo}</span>
            <span className="text-[0.8rem] font-semibold tabular-nums">{ultimoDia ? `${dosCifras(horas)} h` : `${dias ?? "––"} d ${dosCifras(horas)} h`}</span>
          </span>
          <span aria-hidden="true" className="hidden items-center gap-1.5 sm:flex">
            <span className="mr-0.5 hidden text-[0.64rem] uppercase tracking-[0.18em] text-lila-200 md:inline">{rotulo}</span>
            {!ultimoDia && <Unidad valor={dias} etiqueta={dias === 1 ? "día" : "días"} />}
            <Unidad valor={horas} etiqueta="h" />
          </span>
        </div>
      </Container>
    </aside>
  );
}
