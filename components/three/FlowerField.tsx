"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FlowerFallback } from "./FlowerFallback";

const FlowerCanvas = dynamic(() => import("./FlowerCanvas"), { ssr: false });

type Modo = "inicial" | "2d" | "3d";

/** WebGL real, no emulado por software (SwiftShader, llvmpipe…): ahí el 3D costaría más de lo que aporta. */
function tieneGpu(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    return !/swiftshader|llvmpipe|softpipe|software|mesa offscreen|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * Reglas para no cargar three.js:
 * prefers-reduced-motion · sin WebGL por hardware · ≤ 2 GB de RAM · ≤ 2 núcleos ·
 * ahorro de datos · conexión 2G/3G.
 */
function permite3d(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) return false;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|[^4])(2g|3g)$/.test(nav.connection.effectiveType)) return false;
  return tieneGpu();
}

const EVENTOS_INTERACCION = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;

/**
 * Fondo de flores.
 *
 * 1. El SVG (2D) se pinta siempre, desde el HTML, sin JavaScript.
 * 2. Si el dispositivo lo permite, el 3D se descarga tras la carga completa de la página
 *    y solo cuando la persona interactúa (scroll, toque, tecla, ratón) o, como máximo,
 *    a los 9 s. Así el primer render y las métricas de carga no lo notan.
 * 3. Cuando el canvas está listo, el 2D se desvanece y el 3D aparece en su lugar.
 */
export function FlowerField() {
  const [modo, setModo] = useState<Modo>("inicial");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let cancelado = false;
    let timer: number | undefined;
    const fino = window.matchMedia("(pointer: fine)").matches;
    const eventos: string[] = [...EVENTOS_INTERACCION, ...(fino ? ["pointermove"] : [])];

    const limpiarEscucha = () => eventos.forEach((e) => window.removeEventListener(e, montar));
    const montar = () => {
      limpiarEscucha();
      if (timer !== undefined) window.clearTimeout(timer);
      if (!cancelado) setModo("3d");
    };
    const armar = () => {
      if (cancelado) return;
      eventos.forEach((e) => window.addEventListener(e, montar, { passive: true, once: true }));
      timer = window.setTimeout(montar, 9000);
    };

    if (!permite3d()) {
      timer = window.setTimeout(() => {
        if (!cancelado) setModo("2d");
      }, 0);
    } else if (document.readyState === "complete") {
      armar();
    } else {
      window.addEventListener("load", armar, { once: true });
    }

    return () => {
      cancelado = true;
      limpiarEscucha();
      window.removeEventListener("load", armar);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" data-fondo={modo}>
      {/* Aurora: dos veladuras de color muy suaves que dan profundidad al fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_82%_30%,rgb(235_221_243/0.75),transparent_70%),radial-gradient(45%_40%_at_10%_95%,rgb(212_228_229/0.7),transparent_70%)]" />
      <FlowerFallback oculto={listo} />
      {modo === "3d" && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-luxe" style={{ opacity: listo ? 1 : 0 }}>
          <FlowerCanvas
            alListo={() => setListo(true)}
            alPerder={() => {
              setListo(false);
              setModo("2d");
            }}
          />
        </div>
      )}
      {/* Veladura para que el texto del hero siga legible sobre las flores */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_35%,rgb(250_247_252/0.85)_0%,rgb(250_247_252/0.35)_38%,transparent_62%)] lg:bg-[radial-gradient(ellipse_at_15%_45%,rgb(250_247_252/0.9)_0%,rgb(250_247_252/0.4)_30%,transparent_55%)]" />
    </div>
  );
}
