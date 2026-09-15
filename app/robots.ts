import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

/** /robots.txt: se indexa todo salvo la API, el editor del blog y la página interna de estilo. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/keystatic", "/estilo"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
