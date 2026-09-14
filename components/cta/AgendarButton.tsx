"use client";

import { useRouter } from "next/navigation";
import { useSede } from "@/components/sede/SedeProvider";
import { Button, type TamanoBoton, type VarianteBoton } from "@/components/ui/Button";
import { IconoCalendario } from "@/components/ui/Icons";
import type { SedeSlug } from "@/data/sedes";
import { track } from "@/lib/analytics";

interface Props {
  sede?: SedeSlug;
  /** Slug del servicio a preseleccionar en la agenda */
  servicio?: string;
  ubicacion: string;
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  className?: string;
  children?: React.ReactNode;
}

/** Lleva a /agendar con la sede (y el servicio) ya elegidos. */
export function AgendarButton({ sede, servicio, ubicacion, variante = "primario", tamano = "md", className, children }: Props) {
  const router = useRouter();
  const { sede: sedeElegida, pedirSede } = useSede();
  const sedeFinal = sede ?? sedeElegida;

  const destino = (s: SedeSlug) => {
    const params = new URLSearchParams({ sede: s });
    if (servicio) params.set("servicio", servicio);
    return `/agendar?${params.toString()}`;
  };

  const ir = (s: SedeSlug) => {
    track("cta_agendar", { sede: s, ubicacion, servicio });
    router.push(destino(s));
  };

  return (
    <Button
      variante={variante}
      tamano={tamano}
      className={className}
      onClick={() => (sedeFinal ? ir(sedeFinal) : pedirSede(ir))}
    >
      <IconoCalendario className="size-5 transition-transform duration-300 ease-luxe group-hover/boton:-rotate-6 group-hover/boton:scale-110" />
      <span>{children ?? "Agendar valoración"}</span>
    </Button>
  );
}
