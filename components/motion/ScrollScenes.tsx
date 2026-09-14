"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { escena } from "@/lib/escenas";

/**
 * Crea los ScrollTrigger que alimentan la escena 3D:
 * - uno global sobre <main> (progreso 0–1 de toda la página);
 * - uno por cada [data-scene], que marca la sección activa y su progreso;
 * - uno sobre el pie, que apaga el render del canvas cuando ya no se ve.
 * Todo escribe en `escena` (lib/escenas.ts); nada toca el estado de React.
 */
export function ScrollScenes() {
  useGSAP(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const secciones = gsap.utils.toArray<HTMLElement>("[data-scene]");
    escena.total = secciones.length || 1;

    ScrollTrigger.create({
      trigger: main,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        escena.global = self.progress;
        escena.invalidar?.();
      },
      // Si el 3D se monta con la página ya desplazada, arranca en el punto correcto.
      onRefresh: (self) => {
        escena.global = self.progress;
        escena.invalidar?.();
      },
    });

    secciones.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        end: "bottom 20%",
        onUpdate: (self) => {
          if (self.isActive) {
            escena.indice = i;
            escena.progreso = self.progress;
          }
        },
      });
    });

    const footer = document.querySelector("footer");
    if (footer) {
      ScrollTrigger.create({
        trigger: footer,
        start: "top bottom",
        onEnter: () => {
          escena.activo = false;
        },
        onLeaveBack: () => {
          escena.activo = true;
          escena.invalidar?.();
        },
      });
    }
  });

  return null;
}
