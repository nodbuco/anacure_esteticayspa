import type { SedeSlug } from "./sedes";

/* ---------- En qué somos mejores: cuatro insignias ---------- */
export interface Insignia {
  slug: string;
  eyebrow: string;
  titulo: string;
  texto: string;
  /** Comparador antes/después (dos imágenes) o una sola imagen */
  antes?: string;
  despues?: string;
  imagen?: string;
  alt: string;
  servicios: string[]; // slugs
  cta: string;
  soloEn?: SedeSlug;
}

export const INSIGNIAS: Insignia[] = [
  {
    slug: "acne",
    eyebrow: "Salud de la piel",
    titulo: "Pieles con acné que recuperan la calma",
    texto:
      "Es la historia que más veces hemos contado. Protocolos por fases que combinan limpieza, láser, peelings y fórmulas magistrales, con seguimiento constante y sin promesas rápidas. Nuestra serie «Más allá de la piel» muestra un caso real, con autorización, de principio a fin.",
    antes: "/media/insignias/acne-antes.jpg",
    despues: "/media/insignias/acne-despues.jpg",
    alt: "Antes y después de un tratamiento de acné en Ana Cure",
    servicios: ["tratamiento-de-acne", "laser-co2-fraccionado", "peeling-quimico"],
    cta: "Quiero una valoración de mi piel",
  },
  {
    slug: "lifting",
    eyebrow: "Rejuvenecimiento sin cirugía",
    titulo: "Ultraformer III y VOLNEWMER, la dupla",
    texto:
      "Ultrasonido microfocalizado que estimula colágeno desde las capas profundas y radiofrecuencia que regenera la piel. Juntos: más firmeza, un contorno más definido y un resultado natural, progresivo y sin tiempo de incapacidad.",
    antes: "/media/insignias/lifting-antes.jpg",
    despues: "/media/insignias/lifting-despues.jpg",
    alt: "Antes y después de Ultraformer y VOLNEWMER",
    servicios: ["dupla-ultraformer-volnewmer", "ultraformer-iii", "volnewmer"],
    cta: "Quiero saber si es para mí",
  },
  {
    slug: "corporal",
    eyebrow: "Moldeamiento corporal",
    titulo: "Tecnología y manos expertas para tu silueta",
    texto:
      "Venus Legacy, únicos en la zona, con Kumashape, Endospheres y técnicas manuales profesionales. Protocolos reductores y reafirmantes diseñados a la medida de cada cuerpo, con resultados visibles en semanas.",
    antes: "/media/insignias/corporal-antes.jpg",
    despues: "/media/insignias/corporal-despues.jpg",
    alt: "Antes y después de un tratamiento reductor corporal",
    servicios: ["venus-legacy", "kumashape-iii", "endospheres"],
    cta: "Quiero empezar mi cambio",
  },
  {
    slug: "recuperacion",
    eyebrow: "Recuperación y bienestar",
    titulo: "Cámara hiperbárica: respira y renuévate",
    texto:
      "Oxígeno puro a presión para acelerar la recuperación de tejidos, desinflamar y recargar energía. Es el corazón de nuestro acompañamiento postoperatorio y un ritual de bienestar por sí mismo. Disponible en Aguachica.",
    imagen: "/media/insignias/hiperbarica.jpg",
    alt: "Cámara hiperbárica de Ana Cure en Aguachica",
    servicios: ["camara-hiperbarica", "acompanamiento-postoperatorio", "drenaje-linfatico"],
    cta: "Quiero reservar una sesión",
    soloEn: "aguachica",
  },
];

/* ---------- La experiencia: el recorrido ---------- */
export interface Paso {
  slug: string;
  numero: string;
  titulo: string;
  texto: string;
  imagen: string;
  alt: string;
  detalle: string;
}

export const EXPERIENCIA: Paso[] = [
  {
    slug: "llegada",
    numero: "01",
    titulo: "Llegas",
    texto: "Te recibimos por tu nombre, con un espacio pensado para bajar el ritmo desde la puerta.",
    imagen: "/media/experiencia/llegada.jpg",
    alt: "La doctora Ana Cure en la recepción del spa",
    detalle: "Recepción · aromas · silencio",
  },
  {
    slug: "valoracion",
    numero: "02",
    titulo: "Te escuchamos",
    texto: "Una valoración sin costo para entender tu piel, tu cuerpo y lo que buscas. De ahí sale tu protocolo.",
    imagen: "/media/experiencia/valoracion.jpg",
    alt: "Valoración y tratamiento con aparatología en Ana Cure",
    detalle: "Presencial o virtual",
  },
  {
    slug: "protocolo",
    numero: "03",
    titulo: "Tu protocolo",
    texto: "Tecnología de última generación, como el Hydrafacial original, aplicada por manos que llevan años haciéndolo.",
    imagen: "/media/experiencia/facial.jpg",
    alt: "Cabina facial con equipo Hydrafacial",
    detalle: "Facial · corporal · medicina estética",
  },
  {
    slug: "relajate",
    numero: "04",
    titulo: "Relájate",
    texto: "Masaje, exfoliación, chocolaterapia y jacuzzi aromático. El spa que fue nuestro origen sigue en el centro.",
    imagen: "/media/experiencia/jacuzzi.jpg",
    alt: "Jacuzzi aromático con pétalos y velas",
    detalle: "Jacuzzi aromático en Aguachica",
  },
  {
    slug: "respira",
    numero: "05",
    titulo: "Respira",
    texto: "Cámara hiperbárica: oxígeno puro para recuperar, desinflamar y volver a casa con energía.",
    imagen: "/media/experiencia/hiperbarica.jpg",
    alt: "Cámara hiperbárica en la sede de Aguachica",
    detalle: "Solo en Aguachica",
  },
  {
    slug: "equipo",
    numero: "06",
    titulo: "Te acompañamos",
    texto: "Seguimiento después de cada sesión. Un equipo que conoce tu proceso y responde por WhatsApp.",
    imagen: "/media/experiencia/equipo.jpg",
    alt: "Equipo de Ana Cure en la sede de Aguachica",
    detalle: "Dos sedes · un mismo equipo",
  },
];

/* ---------- Marcas y dermocosmética ---------- */
export interface Marca {
  nombre: string;
  origen: string;
  descripcion: string;
}

export const MARCAS: Marca[] = [
  { nombre: "ZO Skin Health", origen: "Dr. Zein Obagi · Estados Unidos", descripcion: "Una filosofía completa de salud de la piel, incorporada en 2026." },
  { nombre: "Uriage", origen: "Francia", descripcion: "Agua termal y dermocosmética. Nuestra marca más constante desde 2017." },
  { nombre: "Cantabria Labs", origen: "España", descripcion: "Innovación dermatológica: Heliocare, Endocare y más." },
  { nombre: "Heliocare", origen: "Cantabria Labs", descripcion: "Fotoprotección avanzada para el sol del Caribe y el Cesar." },
  { nombre: "Medivelius Derma", origen: "Colombia", descripcion: "Dermocosmética profesional de uso en cabina y en casa." },
  { nombre: "Ana Cure Skin Care", origen: "Línea propia", descripcion: "Fórmulas magistrales y productos diseñados para nuestros protocolos." },
];

/* ---------- Historias reales (testimonios en video de Instagram) ---------- */
export interface Historia {
  slug: string;
  titulo: string;
  cita: string;
  contexto: string;
  fecha: string;
  url: string;
  imagen: string;
  alt: string;
  likes?: number;
}

export const HISTORIAS: Historia[] = [
  {
    slug: "mas-alla-de-la-piel",
    titulo: "Más allá de la piel",
    cita: "No vimos una imagen para impresionar; vimos a una persona que necesitaba ser escuchada, orientada y acompañada.",
    contexto: "Un caso real de acné severo en cuatro partes, contado con autorización. Meses de valoraciones, disciplina y acompañamiento.",
    fecha: "Julio de 2026",
    url: "https://www.instagram.com/p/Da6fqX_tTlV/",
    imagen: "/media/historias/mas-alla-de-la-piel.jpg",
    alt: "Joven paciente y la doctora Ana Cure, serie Más allá de la piel",
    likes: 14838,
  },
  {
    slug: "ana-cuatro-sesiones",
    titulo: "Ana, cuatro sesiones",
    cita: "Se siente feliz con los resultados que ha venido viendo y motivada al notar cómo su constancia está dando frutos.",
    contexto: "Una paciente comparte su experiencia a mitad de su tratamiento.",
    fecha: "Julio de 2026",
    url: "https://www.instagram.com/p/DaSz6QdMjLq/",
    imagen: "/media/historias/ana-cuatro-sesiones.jpg",
    alt: "Paciente de Ana Cure compartiendo su experiencia",
  },
  {
    slug: "manchas-y-acne",
    titulo: "Manchas y acné",
    cita: "Sus manchas y acné han mejorado notablemente. Está encantada con los resultados.",
    contexto: "Testimonio de una paciente al terminar su protocolo facial.",
    fecha: "Agosto de 2025",
    url: "https://www.instagram.com/p/DNl3PgRP80Y/",
    imagen: "/media/historias/manchas-y-acne.jpg",
    alt: "Paciente de Ana Cure con manchas y acné tratados",
  },
  {
    slug: "facial-corporal-postoperatorio",
    titulo: "Facial, corporal y postoperatorio",
    cita: "Resultados visibles, acompañamiento constante y cuidado con amor.",
    contexto: "Ella confió en Ana Cure para sus tratamientos faciales, corporales y su postoperatorio.",
    fecha: "Diciembre de 2025",
    url: "https://www.instagram.com/p/DSkT_kqjQ3Z/",
    imagen: "/media/historias/facial-corporal-postoperatorio.jpg",
    alt: "Paciente de Ana Cure contando su experiencia",
  },
];
