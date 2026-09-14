/** Datos generales del sitio. Cambia aquí y se actualiza en todas las páginas. */
export const SITE = {
  nombre: "Ana Cure Estética & Spa",
  nombreCorto: "Ana Cure Spa",
  /** El logo escribe «ESTETICA & SPA» sin tilde; en texto corrido va con tilde. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anacure.co",
  descripcion:
    "Centro de estética avanzada y spa en El Banco (Magdalena) y Aguachica (Cesar). Medicina estética, tecnología de última generación y bienestar. Tu primera cita es una valoración sin costo.",
  instagram: "https://www.instagram.com/anacure_spa",
  instagramUsuario: "@anacure_spa",
  /** Sitio hermano: pendiente de dominio definitivo. */
  urlClinica: "https://clinica.anacure.co",
  legal: {
    razonSocial: "Clínica Ana Cure Spa S.A.S.",
    nit: "901.438.992",
    representante: "Ana Mercedes Cure Saltaren",
    direccion: "Cra 33 # 3-27, Aguachica, Cesar, Colombia",
    /** TODO: correo real para peticiones de habeas data. */
    correoDatos: "datos@anacure.co",
  },
  frases: {
    hero: "Donde el cuidado se convierte en experiencia",
    protocolo: "En Ana Cure, cada piel tiene su propio protocolo",
    consentirte: "Experimenta el placer de consentirte plenamente",
  },
} as const;
