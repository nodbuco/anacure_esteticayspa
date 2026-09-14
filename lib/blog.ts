import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

export interface ArticuloResumen {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  categoria: string;
  imagen: string | null;
  imagenAlt: string;
  productos: readonly string[];
}

export const CATEGORIAS_BLOG: Record<string, string> = {
  piel: "Cuidado de la piel",
  tratamientos: "Tratamientos",
  bienestar: "Spa y bienestar",
  novedades: "Novedades",
};

/** Artículos publicados, del más reciente al más antiguo. */
export async function listarArticulos(): Promise<ArticuloResumen[]> {
  const entradas = await reader.collections.articulos.all();
  return entradas
    .filter((e) => e.entry.publicado)
    .map((e) => ({
      slug: e.slug,
      titulo: e.entry.titulo,
      resumen: e.entry.resumen,
      fecha: e.entry.fecha ?? "",
      categoria: e.entry.categoria,
      imagen: e.entry.imagen,
      imagenAlt: e.entry.imagenAlt,
      productos: e.entry.productos,
    }))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export function formatearFecha(iso: string): string {
  if (!iso) return "";
  const [a, m, d] = iso.split("-").map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(fecha);
}
