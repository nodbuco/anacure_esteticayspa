"use client";

import { useEffect, useRef } from "react";
import { LISTA_SEDES, type SedeSlug } from "@/data/sedes";
import { cn } from "@/lib/cn";
import { IconoCerrar, IconoUbicacion } from "@/components/ui/Icons";

interface Props {
  abierto: boolean;
  actual: SedeSlug | null;
  alElegir: (sede: SedeSlug) => void;
  alCerrar: () => void;
}

/** Diálogo nativo <dialog>: accesible, con foco atrapado y cierre con Escape. */
export function SedeDialog({ abierto, actual, alElegir, alCerrar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      aria-labelledby="sede-titulo"
      className="m-auto w-[min(92vw,34rem)] rounded-card bg-blanco p-0 text-tinta shadow-float backdrop:bg-transparent open:animate-[aparecer_.35s_var(--ease-out-expo)]"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-pill text-gris hover:bg-lila-100 hover:text-tinta"
        >
          <IconoCerrar className="size-5" />
        </button>
        <p className="titular text-eyebrow text-verde">Tu sede</p>
        <h2 id="sede-titulo" className="titular mt-2 text-display-md">
          ¿Dónde quieres atenderte?
        </h2>
        <p className="mt-2 text-gris">Cada sede tiene su propio WhatsApp y su propia agenda.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {LISTA_SEDES.map((s) => {
            const activa = s.slug === actual;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => alElegir(s.slug)}
                className={cn(
                  "group flex min-h-28 flex-col items-start rounded-[1.1rem] border p-4 text-left transition-colors duration-300",
                  activa
                    ? "border-purpura bg-lila-100"
                    : "border-linea bg-blanco hover:border-purpura hover:bg-lila-50",
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
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-xs text-gris">Puedes cambiar de sede cuando quieras.</p>
      </div>
    </dialog>
  );
}
