import { HORARIO, LISTA_SEDES, type Sede } from "@/data/sedes";
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

/** Organización y sitio web (schema.org), para el layout raíz. */
export function jsonLdOrganizacion() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organizacion`,
        name: SITE.nombre,
        legalName: SITE.legal.razonSocial,
        taxID: SITE.legal.nit,
        url: SITE.url,
        logo: `${SITE.url}/brand/logo-vertical-color-1500.png`,
        image: `${SITE.url}/og/portada.jpg`,
        sameAs: [SITE.instagram],
        address: {
          "@type": "PostalAddress",
          streetAddress: SEDES_DIRECCION_LEGAL,
          addressLocality: "Aguachica",
          addressRegion: "Cesar",
          addressCountry: "CO",
        },
        contactPoint: LISTA_SEDES.map((s) => ({
          "@type": "ContactPoint",
          telephone: s.telefonoInternacional,
          contactType: "customer service",
          areaServed: "CO",
          availableLanguage: "es",
          name: `Sede ${s.nombre}`,
        })),
        subOrganization: LISTA_SEDES.map((s) => ({ "@id": `${SITE.url}/sedes/${s.slug}#negocio` })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#sitio`,
        url: SITE.url,
        name: SITE.nombre,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE.url}/#organizacion` },
      },
    ],
  };
}

const SEDES_DIRECCION_LEGAL = "Cra 33 # 3-27";
