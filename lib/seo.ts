import { HORARIO, type Sede } from "@/data/sedes";
import { SITE } from "@/data/site";

/** Datos estructurados schema.org de una sede (HealthAndBeautyBusiness). */
export function jsonLdSede(sede: Sede) {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${SITE.url}/sedes/${sede.slug}#negocio`,
    name: `${SITE.nombre} · ${sede.nombre}`,
    url: `${SITE.url}/sedes/${sede.slug}`,
    image: `${SITE.url}/media/sedes/${sede.slug}.jpg`,
    telephone: sede.telefonoInternacional,
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.direccion + (sede.barrio ? `, ${sede.barrio}` : ""),
      addressLocality: sede.ciudad,
      addressRegion: sede.departamento,
      addressCountry: "CO",
    },
    openingHoursSpecification: HORARIO.estructurado.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.cierra,
    })),
    priceRange: "$$",
    parentOrganization: { "@type": "Organization", name: SITE.legal.razonSocial, url: SITE.url },
    sameAs: [SITE.instagram],
  };
}
