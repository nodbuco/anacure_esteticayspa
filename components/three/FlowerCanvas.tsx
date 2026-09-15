"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollScenes } from "@/components/motion/ScrollScenes";
import { escena } from "@/lib/escenas";
import { Flores } from "./Flores";
import { COLORES } from "./petalo";

/**
 * Canvas de React Three Fiber. Se carga con next/dynamic (ssr: false) desde FlowerField,
 * después del evento load y en tiempo ocioso, así que nunca participa en el LCP.
 *
 * - dpr máximo 1,5: nitidez suficiente, la mitad de píxeles que 2×.
 * - flat: sin tone mapping, para que los colores del kit lleguen intactos.
 * - alpha: el fondo lo pone la página; la niebla usa el mismo color (lila-50)
 *   para que las flores lejanas se fundan con él.
 */
export default function FlowerCanvas({ alListo, alPerder }: { alListo?: () => void; alPerder?: () => void }) {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const mover = (e: PointerEvent) => {
      escena.puntero.x = (e.clientX / window.innerWidth) * 2 - 1;
      escena.puntero.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  return (
    <>
      {/* GSAP y ScrollTrigger viajan en este mismo chunk diferido: solo existen si hay 3D. */}
      <ScrollScenes />
      <Canvas
      dpr={[1, 1.5]}
      flat
      frameloop="always"
      camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", stencil: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Si el navegador libera la GPU (pestaña en segundo plano en el móvil, poca memoria) y no la
        // devuelve en un segundo, se vuelve al fondo 2D en lugar de dejar el fondo vacío.
        const lienzo = gl.domElement;
        lienzo.addEventListener("webglcontextlost", () => {
          window.setTimeout(() => {
            if (lienzo.isConnected && gl.getContext().isContextLost()) alPerder?.();
          }, 1000);
        });
        alListo?.();
      }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <fog attach="fog" args={[COLORES.fondo, 10.5, 21]} />
      <hemisphereLight args={["#FFFFFF", "#DAC0E8", 0.55]} />
      <directionalLight position={[5, 7, 8]} intensity={2.1} />
      <directionalLight position={[-6, -3, 4]} intensity={0.5} color="#D4E4E5" />
      <ambientLight intensity={0.25} />
      <Flores />
      </Canvas>
    </>
  );
}
