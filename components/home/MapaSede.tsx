import { IconoUbicacion } from "@/components/ui/Icons";
import type { Sede } from "@/data/sedes";

/**
 * Mapa de Google de la sede, visible sin clics.
 * El iframe es diferido (loading="lazy"): el navegador lo descarga cuando la sección se acerca
 * a la pantalla, así no pesa en la carga inicial del inicio. Mientras llega, se ve el pin sobre lila.
 */
export function MapaSede({ sede }: { sede: Sede }) {
  const consulta = encodeURIComponent(`Ana Cure Estética y Spa, ${sede.direccion}, ${sede.ciudad}, ${sede.departamento}`);
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl border border-linea bg-lila-100">
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <IconoUbicacion className="size-6 text-purpura/60" />
        <span className="text-xs text-gris">Cargando el mapa de {sede.nombre}…</span>
      </div>
      <iframe
        title={`Mapa de la sede ${sede.nombre}`}
        src={`https://www.google.com/maps?q=${consulta}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}
