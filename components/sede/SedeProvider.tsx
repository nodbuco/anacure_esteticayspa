"use client";

import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore } from "react";
import { esSede, type SedeSlug } from "@/data/sedes";
import { track } from "@/lib/analytics";
import { SedeDialog } from "./SedeDialog";

const CLAVE = "ac-sede";

/* Almacén externo: memoria + localStorage. Se lee con useSyncExternalStore para
   que el servidor y el cliente pinten lo mismo en la hidratación. */
let enMemoria: SedeSlug | null = null;
const oyentes = new Set<() => void>();

function leerSede(): SedeSlug | null {
  if (enMemoria) return enMemoria;
  try {
    const guardada = window.localStorage.getItem(CLAVE);
    return esSede(guardada) ? guardada : null;
  } catch {
    return null;
  }
}

function guardarSede(sede: SedeSlug) {
  enMemoria = sede;
  try {
    window.localStorage.setItem(CLAVE, sede);
  } catch {
    /* sin persistencia: queda en memoria durante la visita */
  }
  oyentes.forEach((cb) => cb());
}

function suscribir(cb: () => void) {
  oyentes.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    oyentes.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const enServidor = () => null;

interface ContextoSede {
  sede: SedeSlug | null;
  /** Guarda la sede elegida (y la recuerda en este navegador). */
  elegirSede: (sede: SedeSlug) => void;
  /** Abre el diálogo de sede y ejecuta el callback con la elección. */
  pedirSede: (despues?: (sede: SedeSlug) => void) => void;
}

const Ctx = createContext<ContextoSede | null>(null);

export function SedeProvider({ children }: { children: React.ReactNode }) {
  const sede = useSyncExternalStore(suscribir, leerSede, enServidor);
  const [abierto, setAbierto] = useState(false);
  const pendiente = useRef<((sede: SedeSlug) => void) | null>(null);

  const elegirSede = useCallback((nueva: SedeSlug) => {
    guardarSede(nueva);
    track("sede_seleccionada", { sede: nueva });
  }, []);

  const pedirSede = useCallback((despues?: (sede: SedeSlug) => void) => {
    pendiente.current = despues ?? null;
    setAbierto(true);
  }, []);

  const alElegir = useCallback(
    (nueva: SedeSlug) => {
      elegirSede(nueva);
      setAbierto(false);
      const cb = pendiente.current;
      pendiente.current = null;
      cb?.(nueva);
    },
    [elegirSede],
  );

  const alCerrar = useCallback(() => {
    setAbierto(false);
    pendiente.current = null;
  }, []);

  return (
    <Ctx.Provider value={{ sede, elegirSede, pedirSede }}>
      {children}
      <SedeDialog abierto={abierto} alElegir={alElegir} alCerrar={alCerrar} actual={sede} />
    </Ctx.Provider>
  );
}

export function useSede(): ContextoSede {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSede debe usarse dentro de <SedeProvider>");
  return ctx;
}
