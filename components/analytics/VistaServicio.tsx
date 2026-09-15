"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Registra el evento «vista_servicio» al abrir la página de un tratamiento. No pinta nada. */
export function VistaServicio({ servicio, categoria }: { servicio: string; categoria: string }) {
  useEffect(() => {
    track("vista_servicio", { servicio, categoria });
  }, [servicio, categoria]);
  return null;
}
