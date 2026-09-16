"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./WhatsAppButton";

/** Hero en una columna (móvil y tablet vertical): la foto va debajo del texto y de su botón de WhatsApp. */
const APILADO = "(max-width: 63.99rem)";
/** Aire mínimo entre el botón y lo que evita, para que nunca quede pegado. */
const HOLGURA = 32;

/**
 * Botón flotante presente en todo el sitio, salvo en la agenda (allí ya hay WhatsApp a la vista y taparía las horas).
 *
 * Se aparta de los elementos marcados con data-evita-flotante:
 * - Por defecto, mientras el elemento pasa por la esquina que ocupa el botón (con HOLGURA de aire).
 *   En pantallas grandes, donde no hay choque, sigue visible.
 * - Con data-evita-flotante="hasta-pasar" (el retrato del hero) y el hero en una columna, espera
 *   a que el elemento termine de pasar por encima: al entrar al inicio en el celular ya está el
 *   botón de WhatsApp del hero y el flotante sería redundante.
 * En el inicio arranca apartado hasta la primera medición, para no aparecer y desvanecerse.
 */
export function FloatingWhatsApp() {
  const ruta = usePathname();
  const boton = useRef<HTMLDivElement>(null);
  const [choque, setChoque] = useState<{ ruta: string; encima: boolean } | null>(null);
  const sinBoton = ruta.startsWith("/agendar") || ruta.startsWith("/keystatic");

  useEffect(() => {
    const el = boton.current;
    const marco = el?.offsetParent;
    const obstaculos = [...document.querySelectorAll<HTMLElement>("[data-evita-flotante]")];
    if (!el || !marco || obstaculos.length === 0) return;

    let observadores: IntersectionObserver[] = [];
    const vigilar = () => {
      observadores.forEach((o) => o.disconnect());
      const bloquean = new Set<Element>();
      const avisar = () => setChoque({ ruta, encima: bloquean.size > 0 });
      // offsetTop/offsetLeft no cambian con la transformación del propio desvanecido.
      const caja = marco.getBoundingClientRect();
      const arriba = Math.max(0, Math.round(caja.top + el.offsetTop - HOLGURA));
      const izquierda = Math.max(0, Math.round(caja.left + el.offsetLeft - HOLGURA));

      const esquina = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) bloquean.add(entrada.target);
            else bloquean.delete(entrada.target);
          }
          avisar();
        },
        { rootMargin: `-${arriba}px 0px 0px -${izquierda}px` },
      );
      // Desde el botón hacia abajo, a todo lo ancho y más allá del final de la pantalla: el elemento
      // «intersecta» mientras no haya terminado de pasar por encima del botón. Así cualquier cambio avisa,
      // también un salto directo arriba de la página (como al tocar la barra de estado del iPhone).
      const franja = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) bloquean.add(entrada.target);
            else bloquean.delete(entrada.target);
          }
          avisar();
        },
        { rootMargin: `-${arriba}px 0px 100000px 0px` },
      );
      observadores = [esquina, franja];

      const apilado = window.matchMedia(APILADO).matches;
      for (const o of obstaculos) {
        (apilado && o.dataset.evitaFlotante === "hasta-pasar" ? franja : esquina).observe(o);
      }
    };

    vigilar();
    window.addEventListener("resize", vigilar);
    return () => {
      observadores.forEach((o) => o.disconnect());
      window.removeEventListener("resize", vigilar);
    };
  }, [ruta, sinBoton]);

  if (sinBoton) return null;
  const apartado = choque?.ruta === ruta ? choque.encima : ruta === "/";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 sm:pb-[max(1rem,env(safe-area-inset-bottom))] lg:pr-4">
      <div
        ref={boton}
        data-apartado={apartado || undefined}
        className="pointer-events-auto relative transition-[opacity,translate,scale,visibility] duration-300 ease-out-expo data-[apartado]:invisible data-[apartado]:translate-y-3 data-[apartado]:scale-90 data-[apartado]:opacity-0"
      >
        <span aria-hidden="true" className="anillo-atencion absolute inset-0 rounded-pill bg-verde/40" />
        {/* En escritorio, un punto más compacto y más al borde: no compite con el retrato del hero */}
        <WhatsAppButton ubicacion="flotante" tamano="lg" className="relative shadow-float pl-5 pr-6 lg:min-h-12 lg:pl-4 lg:pr-5 lg:text-[0.95rem]">
          WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
}
