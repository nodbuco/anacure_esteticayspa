"use client";

import { WhatsAppButton } from "./WhatsAppButton";

/** Botón flotante presente en todo el sitio. */
export function FloatingWhatsApp() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 sm:p-6" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      <div className="pointer-events-auto">
        <WhatsAppButton ubicacion="flotante" tamano="lg" className="shadow-float pl-5 pr-6">
          WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
}
