"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Botón flotante presente en todo el sitio, salvo en la agenda (allí ya hay WhatsApp a la vista y taparía las horas).
 *
 * Se aparta mientras pasa por debajo algo marcado con data-evita-flotante (el retrato del hero):
 * un IntersectionObserver vigila solo la esquina de la pantalla que ocupa el botón, así que en
 * pantallas grandes, donde no hay choque, sigue visible. En el inicio arranca apartado hasta la
 * primera medición, para no aparecer encima de la foto y desvanecerse.
 */
export function FloatingWhatsApp() {
  const ruta = usePathname();
  const boton = useRef<HTMLDivElement>(null);
  const [choque, setChoque] = useState<{ ruta: string; encima: boolean } | null>(null);
  const sinBoton = ruta.startsWith("/agendar") || ruta.startsWith("/keystatic");

  useEffect(() => {
    const el = boton.current;
    const marco = el?.offsetParent;
    const obstaculos = document.querySelectorAll("[data-evita-flotante]");
    if (!el || !marco || obstaculos.length === 0) return;

    let observador: IntersectionObserver | undefined;
    const vigilar = () => {
      observador?.disconnect();
      const encima = new Set<Element>();
      // offsetTop/offsetLeft no cambian con la transformación del propio desvanecido.
      const caja = marco.getBoundingClientRect();
      const margen = 12;
      const arriba = Math.max(0, Math.round(caja.top + el.offsetTop - margen));
      const izquierda = Math.max(0, Math.round(caja.left + el.offsetLeft - margen));
      observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) encima.add(entrada.target);
            else encima.delete(entrada.target);
          }
          setChoque({ ruta, encima: encima.size > 0 });
        },
        { rootMargin: `-${arriba}px 0px 0px -${izquierda}px` },
      );
      obstaculos.forEach((o) => observador?.observe(o));
    };

    vigilar();
    window.addEventListener("resize", vigilar);
    return () => {
      observador?.disconnect();
      window.removeEventListener("resize", vigilar);
    };
  }, [ruta, sinBoton]);

  if (sinBoton) return null;
  const apartado = choque?.ruta === ruta ? choque.encima : ruta === "/";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        ref={boton}
        data-apartado={apartado || undefined}
        className="pointer-events-auto relative transition-[opacity,translate,scale,visibility] duration-300 ease-out-expo data-[apartado]:invisible data-[apartado]:translate-y-3 data-[apartado]:scale-90 data-[apartado]:opacity-0"
      >
        <span aria-hidden="true" className="anillo-atencion absolute inset-0 rounded-pill bg-verde/40" />
        <WhatsAppButton ubicacion="flotante" tamano="lg" className="relative shadow-float pl-5 pr-6">
          WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
}
