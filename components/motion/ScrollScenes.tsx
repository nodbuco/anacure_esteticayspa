"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { escena } from "@/lib/escenas";

/** Enciende o apaga el render del canvas; al encender pide un fotograma. */
function ponerActivo(activo: boolean) {
  if (escena.activo === activo) return;
  escena.activo = activo;
  if (activo) escena.invalidar?.();
}

/**
 * Crea los ScrollTrigger que alimentan la escena 3D:
 * - uno global sobre <main> (progreso 0–1 de toda la página);
 * - uno por cada [data-scene], que marca la sección activa y su progreso;
 * - uno sobre el pie, que apaga el render del canvas mientras el pie está a la vista.
 * Todo escribe en `escena` (lib/escenas.ts); nada toca el estado de React.
 *
 * `escena` es un objeto de módulo y sobrevive a la navegación entre páginas sin recargar,
 * así que se reinicia al montar y al desmontar. Sin esto, quien salía del inicio por un
 * enlace del pie y volvía encontraba la escena «apagada»: las flores nunca se colocaban
 * y quedaban amontonadas en el centro, como un único pétalo.
 */
export function ScrollScenes() {
  useGSAP(() => {
    escena.activo = true;
    escena.pulso = undefined;
    escena.indice = 0;
    escena.progreso = 0;

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
        // Activo mientras el pie está en pantalla: entonces el canvas no necesita dibujar.
        onToggle: (self) => ponerActivo(!self.isActive),
        onRefresh: (self) => ponerActivo(!self.isActive),
      });
    }

    return () => {
      escena.activo = true;
    };
  });

  return null;
}
