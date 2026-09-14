export interface Producto {
  slug: string;
  nombre: string;
  marca: string;
  para: string;
}

export interface MarcaCatalogo {
  slug: string;
  nombre: string;
  origen: string;
  descripcion: string;
  imagen?: string;
  productos: Producto[];
}

/** Catálogo informativo. Sin precios ni venta en línea: se recomiendan en la valoración y se adquieren en las sedes. */
export const CATALOGO: MarcaCatalogo[] = [
  {
    slug: "zo-skin-health",
    nombre: "ZO Skin Health",
    origen: "Dr. Zein Obagi · Estados Unidos",
    descripcion: "Una filosofía completa de salud de la piel: preparar, corregir y mantener. La incorporamos en 2026 y la trabajamos como protocolo, no como producto suelto.",
    productos: [
      { slug: "zo-protocolo", nombre: "Protocolos ZO", marca: "ZO Skin Health", para: "Programas de salud de la piel diseñados en la valoración" },
    ],
  },
  {
    slug: "uriage",
    nombre: "Uriage",
    origen: "Francia",
    descripcion: "Agua termal de los Alpes y dermocosmética para todas las pieles. Es la marca que más tiempo nos ha acompañado, desde 2017.",
    imagen: "/media/productos/uriage.jpg",
    productos: [
      { slug: "uriage-agua-termal", nombre: "Agua Termal", marca: "Uriage", para: "Calmar, hidratar y proteger a diario" },
      { slug: "uriage-bariesun", nombre: "Bariésun", marca: "Uriage", para: "Protección solar muy alta" },
      { slug: "uriage-cica", nombre: "Cica", marca: "Uriage", para: "Reparar la piel después de procedimientos" },
    ],
  },
  {
    slug: "cantabria-labs",
    nombre: "Cantabria Labs",
    origen: "España",
    descripcion: "Innovación dermatológica con respaldo científico.",
    imagen: "/media/productos/cantabria.jpg",
    productos: [
      { slug: "heliocare-360", nombre: "Heliocare 360°", marca: "Cantabria Labs", para: "Fotoprotección avanzada frente al sol del Caribe y el Cesar" },
      { slug: "endocare", nombre: "Endocare", marca: "Cantabria Labs", para: "Regeneración y antiedad" },
    ],
  },
  {
    slug: "medivelius-derma",
    nombre: "Medivelius Derma",
    origen: "Colombia",
    descripcion: "Dermocosmética profesional que usamos en cabina y recomendamos para continuar en casa.",
    productos: [
      { slug: "medivelius-linea", nombre: "Línea profesional", marca: "Medivelius Derma", para: "Continuidad de los protocolos faciales" },
    ],
  },
  {
    slug: "ana-cure-skin-care",
    nombre: "Ana Cure Skin Care",
    origen: "Línea propia",
    descripcion: "Fórmulas magistrales y productos diseñados para nuestros protocolos de acné, manchas y postprocedimiento.",
    productos: [
      { slug: "formulas-magistrales", nombre: "Fórmulas magistrales", marca: "Ana Cure Skin Care", para: "Preparadas a la medida de cada piel" },
    ],
  },
];

export const PRODUCTOS: Producto[] = CATALOGO.flatMap((m) => m.productos);
export function productoPorSlug(slug: string) {
  return PRODUCTOS.find((p) => p.slug === slug);
}
