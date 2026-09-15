"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./WhatsAppButton";

/** Botón flotante presente en todo el sitio, salvo en la agenda (allí ya hay WhatsApp a la vista y taparía las horas). */
export function FloatingWhatsApp() {
  const ruta = usePathname();
  if (ruta.startsWith("/agendar") || ruta.startsWith("/keystatic")) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto relative">
        <span aria-hidden="true" className="anillo-atencion absolute inset-0 rounded-pill bg-verde/40" />
        <WhatsAppButton ubicacion="flotante" tamano="lg" className="relative shadow-float pl-5 pr-6">
          WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
}
