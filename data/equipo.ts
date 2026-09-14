export interface Persona {
  slug: string;
  nombre: string;
  rol: string;
  descripcion: string;
  /** Se muestra en la web. Ana pidió reservar al resto del equipo para más adelante. */
  visible: boolean;
  imagen?: string;
}

export const EQUIPO: Persona[] = [
  {
    slug: "ana-cure",
    nombre: "Dra. Ana Cure",
    rol: "Gerente y fundadora · Cosmetóloga",
    descripcion:
      "Cosmetóloga con maestría internacional en cosmética (ESNECA Business School, Barcelona). Fundó Ana Cure en 2015 y ha guiado su evolución de salón de belleza a centro de estética avanzada y spa, con dos sedes y una clínica estética hermana.",
    visible: true,
    imagen: "/media/sobre/ana-cure-tecnologia.jpg",
  },
  {
    slug: "javier-de-la-rosa",
    nombre: "Dr. Javier de la Rosa",
    rol: "Medicina estética facial",
    descripcion:
      "Armonización facial, RinoLips y su técnica registrada Hybrid Lips®. Trabaja con toxina botulínica, ácido hialurónico y bioestimuladores buscando siempre un resultado natural.",
    visible: true,
  },
  { slug: "alan-rodriguez", nombre: "Dr. Alan Rodríguez", rol: "Cirujano plástico", descripcion: "Procedimientos quirúrgicos en la Clínica Estética Ana Cure.", visible: false },
  { slug: "diana-garcia", nombre: "Dra. Diana García", rol: "Equipo médico", descripcion: "", visible: false },
  { slug: "carlos-romero", nombre: "Dr. Carlos Romero", rol: "Equipo médico", descripcion: "", visible: false },
];

/** Títulos y reconocimientos de la Dra. Ana Cure. Añade aquí los que quieras mostrar; la sección aparece sola. */
export const TITULOS: Array<{ titulo: string; institucion: string; anio?: string }> = [
  { titulo: "Maestría internacional en cosmética", institucion: "ESNECA Business School · Barcelona", anio: "2023" },
];

/** Marcas y tecnologías insignia. Añade aquí las que quieras destacar; la sección aparece sola. */
export const MARCAS_INSIGNIA: Array<{ nombre: string; que: string }> = [
  { nombre: "Ultraformer III", que: "Ultrasonido micro y macrofocalizado" },
  { nombre: "VOLNEWMER", que: "Radiofrecuencia de bioestimulación" },
  { nombre: "Hydrafacial", que: "Equipo original, únicos en la zona" },
  { nombre: "Venus Legacy", que: "Radiofrecuencia multipolar, únicos en la zona" },
  { nombre: "Láser CO₂ Lutronic", que: "Renovación fraccionada" },
  { nombre: "Cámara hiperbárica", que: "Oxigenación, en Aguachica" },
];

export const HITOS: Array<{ anio: string; titulo: string; texto: string }> = [
  { anio: "2015", titulo: "Nace Ana Cure", texto: "Un salón de belleza y estética en El Banco, Magdalena: cejas, pestañas, maquillaje y limpiezas faciales." },
  { anio: "2020", titulo: "Aparatología", texto: "Llegan Venus Legacy, láser de diodo, Emsculpt y Kumashape. El spa se convierte en centro de estética avanzada." },
  { anio: "2021", titulo: "Aguachica", texto: "Segunda sede en Aguachica, Cesar, con jacuzzi, baño turco y la primera cámara hiperbárica de la región." },
  { anio: "2024", titulo: "Medicina estética", texto: "Armonización, bioestimuladores y la Clínica Estética Ana Cure, en el mismo edificio de Aguachica." },
  { anio: "2025", titulo: "Reapertura de El Banco", texto: "La sede original se renueva por completo, con nuevos espacios y servicios." },
  { anio: "2026", titulo: "Ultraformer III, VOLNEWMER y dermocosmética", texto: "Nueva tecnología de lifting sin cirugía y una noche de lanzamiento de dermocosmética en el Hotel Panorama." },
];
