import type { MetadataRoute } from "next";
import { LISTA_SEDES } from "@/data/sedes";
import { SERVICIOS } from "@/data/servicios";
import { SITE } from "@/data/site";
import { listarArticulos } from "@/lib/blog";

/** /sitemap.xml: todas las páginas públicas. Se genera en el build. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const ahora = new Date();
  const articulos = await listarArticulos();

  const fijas: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: ahora, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/servicios`, lastModified: ahora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/agendar`, lastModified: ahora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/sobre-ana-cure`, lastModified: ahora, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/productos`, lastModified: ahora, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/blog`, lastModified: ahora, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacidad`, lastModified: ahora, changeFrequency: "yearly", priority: 0.2 },
  ];

  const sedes: MetadataRoute.Sitemap = LISTA_SEDES.map((s) => ({
    url: `${base}/sedes/${s.slug}`,
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const servicios: MetadataRoute.Sitemap = SERVICIOS.map((s) => ({
    url: `${base}/servicios/${s.slug}`,
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: s.destacado ? 0.8 : 0.7,
  }));

  const blog: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.fecha),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...fijas, ...sedes, ...servicios, ...blog];
}
