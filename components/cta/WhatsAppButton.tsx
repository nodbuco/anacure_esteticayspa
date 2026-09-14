"use client";

import { useSede } from "@/components/sede/SedeProvider";
import { Button, type TamanoBoton, type VarianteBoton } from "@/components/ui/Button";
import { IconoWhatsApp } from "@/components/ui/Icons";
import type { SedeSlug } from "@/data/sedes";
import { track } from "@/lib/analytics";
import { urlWhatsApp, type OpcionesWhatsApp } from "@/lib/whatsapp";

interface Props extends OpcionesWhatsApp {
  /** Fuerza una sede concreta (por ejemplo, en la página de esa sede). */
  sede?: SedeSlug;
  /** Dónde está el botón, para analítica: hero, flotante, servicio… */
  ubicacion: string;
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  className?: string;
  children?: React.ReactNode;
  soloIcono?: boolean;
}

/**
 * Botón de WhatsApp. Si ya se conoce la sede, es un enlace directo wa.me.
 * Si no, abre el selector de sede y luego abre el chat.
 */
export function WhatsAppButton({ sede, ubicacion, servicio, mensaje, variante = "whatsapp", tamano = "md", className, children, soloIcono }: Props) {
  const { sede: sedeElegida, pedirSede } = useSede();
  const sedeFinal = sede ?? sedeElegida;
  const etiqueta = children ?? "Escríbenos por WhatsApp";

  const contenido = (
    <>
      <IconoWhatsApp className={soloIcono ? "size-6" : "size-5"} />
      {soloIcono ? <span className="sr-only">{etiqueta}</span> : <span>{etiqueta}</span>}
    </>
  );

  if (sedeFinal) {
    return (
      <Button
        href={urlWhatsApp(sedeFinal, { servicio, mensaje })}
        externo
        variante={variante}
        tamano={soloIcono ? "icono" : tamano}
        className={className}
        onClick={() => track("cta_whatsapp", { sede: sedeFinal, ubicacion, servicio })}
        aria-label={soloIcono ? String(etiqueta) : undefined}
      >
        {contenido}
      </Button>
    );
  }

  return (
    <Button
      variante={variante}
      tamano={soloIcono ? "icono" : tamano}
      className={className}
      aria-label={soloIcono ? String(etiqueta) : undefined}
      onClick={() =>
        pedirSede((elegida) => {
          track("cta_whatsapp", { sede: elegida, ubicacion, servicio });
          window.open(urlWhatsApp(elegida, { servicio, mensaje }), "_blank", "noopener,noreferrer");
        })
      }
    >
      {contenido}
    </Button>
  );
}
