"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Campo } from "@/components/ui/Campo";
import { IconoWhatsApp } from "@/components/ui/Icons";
import { SEDES, type SedeSlug } from "@/data/sedes";
import { track } from "@/lib/analytics";
import { urlWhatsApp } from "@/lib/whatsapp";

/**
 * Formulario de contacto de una sede. No pasa por ningún servidor: arma el mensaje y lo
 * abre en el WhatsApp de la sede. Cuando haya correo (SMTP) se puede cambiar el destino
 * aquí sin tocar el resto del sitio.
 */
export function FormularioContacto({ sede }: { sede: SedeSlug }) {
  const [error, setError] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);

  const alEnviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const mensaje = String(datos.get("mensaje") ?? "").trim();
    if (nombre.length < 2 || mensaje.length < 5) {
      setError("Escribe tu nombre y tu mensaje.");
      return;
    }
    setError(null);
    track("formulario_contacto", { sede, ubicacion: "sede" });
    const texto = `Hola, soy ${nombre}. ${mensaje} (Escribo desde la página web, sede ${SEDES[sede].nombre}.)`;
    window.open(urlWhatsApp(sede, { mensaje: texto }), "_blank", "noopener,noreferrer");
    setAbierto(true);
  };

  return (
    <form onSubmit={alEnviar} noValidate className="rounded-card border border-linea bg-blanco p-6 shadow-soft sm:p-8">
      <p className="titular text-eyebrow text-verde">Escríbenos</p>
      <h3 className="titular mt-2 text-display-sm">¿Tienes una pregunta?</h3>
      <p className="mt-2 text-sm text-gris">Tu mensaje se abre en el WhatsApp de la sede, con tu nombre ya escrito. Aquí no guardamos nada.</p>
      <div className="mt-6 grid gap-4">
        <Campo etiqueta="Tu nombre" nombre="nombre" autoComplete="given-name" required maxLength={60} error={error ?? undefined} />
        <Campo etiqueta="Tu mensaje" nombre="mensaje" multilinea required maxLength={500} placeholder="Cuéntanos qué te gustaría tratarte o qué necesitas saber." />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variante="whatsapp" className="w-full sm:w-auto">
          <IconoWhatsApp className="size-5" />
          <span>Enviar por WhatsApp</span>
        </Button>
        {abierto && (
          <p className="text-sm text-gris" role="status">
            Se abrió WhatsApp con tu mensaje. Si no lo ves, toca el botón otra vez.
          </p>
        )}
      </div>
    </form>
  );
}
