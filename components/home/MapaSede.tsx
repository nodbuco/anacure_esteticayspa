"use client";

import { useState } from "react";
import { IconoUbicacion } from "@/components/ui/Icons";
import type { Sede } from "@/data/sedes";

/** Mapa de Google que solo se descarga cuando la persona lo pide (ahorra 1 MB en cada visita). */
export function MapaSede({ sede }: { sede: Sede }) {
  const [abierto, setAbierto] = useState(false);
  const consulta = encodeURIComponent(`Ana Cure Estética y Spa, ${sede.direccion}, ${sede.ciudad}, ${sede.departamento}`);
  if (abierto) {
    return (
      <iframe
        title={`Mapa de la sede ${sede.nombre}`}
        src={`https://www.google.com/maps?q=${consulta}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-56 w-full rounded-2xl border-0"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setAbierto(true)}
      className="group flex h-56 w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-lila-300 bg-lila-50/70 text-sm font-medium text-purpura transition-colors hover:bg-lila-100"
    >
      <IconoUbicacion className="size-5 transition-transform group-hover:-translate-y-0.5" />
      Ver el mapa de {sede.nombre}
    </button>
  );
}
