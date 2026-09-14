import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Version = "horizontal" | "vertical" | "isotipo" | "logotipo";
type Color = "color" | "blanco";

/* Proporciones de los SVG del kit (viewBox), para reservar espacio y evitar saltos. */
const dimensiones: Record<Version, { w: number; h: number }> = {
  horizontal: { w: 942, h: 214 },
  vertical: { w: 600, h: 600 },
  isotipo: { w: 213, h: 213 },
  logotipo: { w: 700, h: 200 },
};

const archivos: Record<Version, string> = {
  horizontal: "logo-horizontal",
  vertical: "logo-vertical",
  isotipo: "isotipo",
  logotipo: "logotipo",
};

interface LogoProps {
  version?: Version;
  color?: Color;
  /** Define la altura (p. ej. "h-12"). El ancho se calcula solo. */
  className?: string;
  enlace?: boolean;
  prioridad?: boolean;
}

/**
 * Logos del kit, sin modificar. Tamaños mínimos del manual:
 * horizontal 200 px de ancho, vertical 150 px, isotipo 48 px, logotipo 150 px.
 */
export function Logo({ version = "horizontal", color = "color", className = "h-12", enlace = false, prioridad }: LogoProps) {
  const { w, h } = dimensiones[version];
  const img = (
    <Image
      src={`/brand/${archivos[version]}-${color}.svg`}
      alt="Ana Cure Estética & Spa"
      width={w}
      height={h}
      className={cn("w-auto", className)}
      unoptimized
      priority={prioridad}
    />
  );
  if (!enlace) return img;
  return (
    <Link href="/" aria-label="Ana Cure Estética & Spa, ir al inicio" className="inline-flex shrink-0 rounded-md">
      {img}
    </Link>
  );
}
