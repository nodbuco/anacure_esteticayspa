import type { SedeSlug } from "./sedes";

export type CategoriaSlug = "facial" | "medicina-estetica" | "corporal" | "spa" | "belleza";

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  corto: string;
  descripcion: string;
  /** Nombre de la categoría en Easy!Appointments */
  eaNombre: string;
}

export const CATEGORIAS: Categoria[] = [
  {
    slug: "facial",
    nombre: "Facial y salud de la piel",
    corto: "Facial",
    descripcion: "Acné, manchas, cicatrices, hidratación profunda y lifting sin cirugía con la tecnología más avanzada de la región.",
    eaNombre: "Facial y salud de la piel",
  },
  {
    slug: "medicina-estetica",
    nombre: "Medicina estética",
    corto: "Medicina estética",
    descripcion: "Armonización facial, toxina botulínica, rellenos, bioestimuladores y las técnicas del Dr. Javier de la Rosa.",
    eaNombre: "Medicina estética",
  },
  {
    slug: "corporal",
    nombre: "Corporal y moldeamiento",
    corto: "Corporal",
    descripcion: "Moldeamiento, reducción, firmeza y acompañamiento postoperatorio con aparatología de última generación.",
    eaNombre: "Corporal y moldeamiento",
  },
  {
    slug: "spa",
    nombre: "Spa y bienestar",
    corto: "Spa",
    descripcion: "Masajes, exfoliación, chocolaterapia, jacuzzi aromático, cámara hiperbárica y celebraciones.",
    eaNombre: "Spa y bienestar",
  },
  {
    slug: "belleza",
    nombre: "Cejas, pestañas y belleza",
    corto: "Belleza",
    descripcion: "Diseño de cejas, pestañas, micropigmentación, maquillaje, manicure, pedicure y peinados.",
    eaNombre: "Cejas, pestañas y belleza",
  },
];

export interface Servicio {
  slug: string;
  nombre: string;
  categoria: CategoriaSlug;
  /** Una frase para tarjetas y listados */
  resumen: string;
  /** Para la página de detalle y la agenda */
  descripcion: string;
  duracionMin: number;
  sedes: SedeSlug[];
  /** Aparece en el home */
  destacado?: boolean;
  /** Se agenda solo por WhatsApp (paquetes, celebraciones) */
  soloWhatsApp?: boolean;
  /** Última mención en redes anterior a 2025: se muestra, pero conviene confirmarlo */
  verificar?: boolean;
  /** Profesional que lo realiza, si es distinto del equipo del spa */
  profesional?: string;
}

const AMBAS: SedeSlug[] = ["el-banco", "aguachica"];
const AGUACHICA: SedeSlug[] = ["aguachica"];
const EL_BANCO: SedeSlug[] = ["el-banco"];

export const SERVICIOS: Servicio[] = [
  /* ---------- Valoración (puerta de entrada) ---------- */
  {
    slug: "valoracion",
    nombre: "Valoración sin costo",
    categoria: "facial",
    resumen: "La primera cita: escuchamos, evaluamos tu piel o tu cuerpo y diseñamos tu protocolo.",
    descripcion:
      "Toda experiencia en Ana Cure empieza con una valoración sin costo, presencial o virtual. Evaluamos tu caso, resolvemos tus dudas y te proponemos un plan a tu medida, sin compromiso.",
    duracionMin: 30,
    sedes: AMBAS,
  },
  {
    slug: "valoracion-virtual",
    nombre: "Valoración virtual",
    categoria: "facial",
    resumen: "La misma valoración, por videollamada, desde donde estés.",
    descripcion: "Si vives lejos o prefieres empezar desde casa, hacemos la primera valoración por videollamada y coordinamos tu visita.",
    duracionMin: 20,
    sedes: AMBAS,
  },

  /* ---------- Facial y salud de la piel ---------- */
  {
    slug: "hydrafacial",
    nombre: "Hydrafacial",
    categoria: "facial",
    resumen: "Limpieza profunda, extracción e hidratación en una sola sesión, sin dolor.",
    descripcion:
      "El facial más reconocido del mundo: limpia, extrae impurezas e hidrata al mismo tiempo. Piel más luminosa, poros más limpios y textura uniforme desde la primera sesión. Trabajamos con el equipo original.",
    duracionMin: 60,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "ultraformer-iii",
    nombre: "Ultraformer III",
    categoria: "facial",
    resumen: "Ultrasonido micro y macrofocalizado: lifting progresivo sin cirugía ni incapacidad.",
    descripcion:
      "Estimula la producción natural de colágeno desde las capas profundas de la piel para reafirmar, definir el contorno facial y tratar flacidez, papada y líneas de expresión. Resultados visibles y sin tiempo de incapacidad.",
    duracionMin: 90,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "volnewmer",
    nombre: "VOLNEWMER",
    categoria: "facial",
    resumen: "Radiofrecuencia de bioestimulación que regenera la piel y mejora su elasticidad.",
    descripcion:
      "Promueve una intensa bioestimulación y regeneración de la piel, mejorando su calidad, elasticidad y luminosidad. Solo o en dupla con Ultraformer para un rejuvenecimiento integral.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "dupla-ultraformer-volnewmer",
    nombre: "Dupla Ultraformer + VOLNEWMER",
    categoria: "facial",
    resumen: "La combinación para un rostro más firme, definido y rejuvenecido sin cirugía.",
    descripcion:
      "Cuando combinamos Ultraformer y VOLNEWMER potenciamos los resultados: firmeza, definición y calidad de piel con un efecto natural, progresivo y duradero.",
    duracionMin: 120,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "laser-co2-fraccionado",
    nombre: "Láser CO₂ fraccionado",
    categoria: "facial",
    resumen: "Cicatrices, poros y textura: renovación profunda de la piel con láser Lutronic.",
    descripcion:
      "Tratamiento de cicatrices de acné, poros dilatados y textura irregular. Se combina con PDRN para acelerar la regeneración.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "zaffiro",
    nombre: "Zaffiro",
    categoria: "facial",
    resumen: "Water peeling y luz infrarroja de Neauvia: limpieza, luminosidad y firmeza.",
    descripcion: "Protocolo Zaffiro de Neauvia con water peeling e infrarrojo para una piel limpia, luminosa y más firme.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "epn",
    nombre: "EPN · microneedling con electroporación",
    categoria: "facial",
    resumen: "Microagujas y electroporación para llevar activos a la profundidad exacta.",
    descripcion: "Electroporation Needling: técnica avanzada que combina microneedling y electroporación para renovar la piel y potenciar la absorción de activos.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "vital-injector",
    nombre: "Vital Injector",
    categoria: "facial",
    resumen: "Hidratación profunda y uniforme con inyección asistida.",
    descripcion: "Hidrata en profundidad con una distribución precisa de activos, para una piel jugosa y luminosa.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "peeling-quimico",
    nombre: "Peeling químico",
    categoria: "facial",
    resumen: "Renovación controlada con ácidos como el ferúlico, según tu tipo de piel.",
    descripcion: "Peelings personalizados para manchas, acné, textura y luminosidad, elegidos según tu piel y la época del año.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "tratamiento-de-acne",
    nombre: "Tratamiento de acné",
    categoria: "facial",
    resumen: "Protocolos por fases para acné, incluidos los casos severos. Nuestra historia más contada.",
    descripcion:
      "Cada piel con acné tiene su propio protocolo: limpieza, láser, peelings, fórmulas magistrales y seguimiento constante. Acompañamos desde el primer día hasta la piel en calma.",
    duracionMin: 60,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "manchas-y-melasma",
    nombre: "Manchas y melasma",
    categoria: "facial",
    resumen: "Unificar el tono de la piel con protocolos combinados y protección.",
    descripcion: "Tratamiento de manchas y melasma con peelings, láser, dermocosmética y un plan de protección solar.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "cicatrices",
    nombre: "Tratamiento de cicatrices",
    categoria: "facial",
    resumen: "Suavizar cicatrices de acné y otras marcas con láser y regeneración.",
    descripcion: "Protocolos combinados (láser CO₂, EPN, PDRN) para mejorar el relieve y el color de las cicatrices.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "punta-de-diamante",
    nombre: "Punta de diamante",
    categoria: "facial",
    resumen: "Microdermoabrasión para renovar la superficie de la piel.",
    descripcion: "Exfoliación mecánica suave que renueva la capa superficial de la piel y mejora su textura.",
    duracionMin: 45,
    sedes: AMBAS,
    verificar: true,
  },

  /* ---------- Medicina estética ---------- */
  {
    slug: "armonizacion-facial",
    nombre: "Armonización facial",
    categoria: "medicina-estetica",
    resumen: "Perfilamiento y equilibrio de los rasgos, con resultado natural.",
    descripcion: "Diseño facial con ácido hialurónico, toxina y bioestimuladores para equilibrar los rasgos sin cambiarlos.",
    duracionMin: 60,
    sedes: AMBAS,
    destacado: true,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "toxina-botulinica",
    nombre: "Toxina botulínica",
    categoria: "medicina-estetica",
    resumen: "Suavizar líneas de expresión con Xeomin.",
    descripcion: "Aplicación de toxina botulínica (Xeomin) para líneas de expresión, con un resultado fresco y natural.",
    duracionMin: 30,
    sedes: AMBAS,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "acido-hialuronico",
    nombre: "Ácido hialurónico",
    categoria: "medicina-estetica",
    resumen: "Volumen y definición en tercio medio, surcos y mentón con Belotero.",
    descripcion: "Rellenos de ácido hialurónico (Belotero) para tercio medio, surcos, mentón y labios.",
    duracionMin: 45,
    sedes: AMBAS,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "rinolips",
    nombre: "RinoLips",
    categoria: "medicina-estetica",
    resumen: "Rinomodelación y labios en una sola sesión.",
    descripcion: "Técnica que combina rinomodelación y perfilado de labios en una misma sesión.",
    duracionMin: 60,
    sedes: AMBAS,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "hybrid-lips",
    nombre: "Hybrid Lips®",
    categoria: "medicina-estetica",
    resumen: "La técnica registrada del Dr. de la Rosa para unos labios naturales.",
    descripcion: "Técnica registrada de perfilado de labios que combina hidratación y definición con un resultado natural.",
    duracionMin: 60,
    sedes: AMBAS,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "armonizacion-de-orejas",
    nombre: "Armonización de orejas",
    categoria: "medicina-estetica",
    resumen: "Ambulatoria y sin cirugía.",
    descripcion: "Corrección estética de la posición de las orejas de forma ambulatoria y sin cirugía.",
    duracionMin: 45,
    sedes: AMBAS,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "bioestimuladores",
    nombre: "Bioestimuladores",
    categoria: "medicina-estetica",
    resumen: "Radiesse y Sculptra: colágeno propio para firmeza duradera.",
    descripcion: "Bioestimuladores de colágeno (Radiesse, Sculptra) para recuperar firmeza y calidad de piel de forma progresiva.",
    duracionMin: 45,
    sedes: AMBAS,
    profesional: "Dr. Javier de la Rosa",
  },
  {
    slug: "pdrn",
    nombre: "PDRN · polinucleótidos",
    categoria: "medicina-estetica",
    resumen: "Regeneración celular profunda para una piel más sana.",
    descripcion: "Polinucleótidos que estimulan la regeneración de la piel; ideales tras láser o para pieles fatigadas.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "plasma-rico-en-plaquetas",
    nombre: "Plasma rico en plaquetas",
    categoria: "medicina-estetica",
    resumen: "ACP de Arthrex: no todos los plasmas son iguales.",
    descripcion: "Plasma rico en plaquetas con el sistema ACP de Arthrex para regenerar y revitalizar la piel.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "regeneracion-facial-masculina",
    nombre: "Regeneración facial masculina",
    categoria: "medicina-estetica",
    resumen: "Protocolos pensados para la piel y los rasgos del hombre.",
    descripcion: "Tratamientos de regeneración y armonización diseñados para el rostro masculino.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "hilos-tensores",
    nombre: "Hilos tensores",
    categoria: "medicina-estetica",
    resumen: "Efecto tensor y estímulo de colágeno sin cirugía.",
    descripcion: "Hilos reabsorbibles que reposicionan tejidos y estimulan colágeno.",
    duracionMin: 60,
    sedes: AMBAS,
    verificar: true,
  },
  {
    slug: "mesoterapia-capilar",
    nombre: "Mesoterapia capilar",
    categoria: "medicina-estetica",
    resumen: "Nutrición del cuero cabelludo para frenar la caída.",
    descripcion: "Microinyecciones de activos en el cuero cabelludo para fortalecer el cabello y frenar la alopecia.",
    duracionMin: 45,
    sedes: AMBAS,
    verificar: true,
  },

  /* ---------- Corporal y moldeamiento ---------- */
  {
    slug: "venus-legacy",
    nombre: "Venus Legacy",
    categoria: "corporal",
    resumen: "Radiofrecuencia multipolar con pulsos magnéticos. Únicos en la zona.",
    descripcion: "Reafirma, reduce y mejora la celulitis combinando radiofrecuencia multipolar y pulsos magnéticos. Somos los únicos en la región con este equipo.",
    duracionMin: 45,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "kumashape-iii",
    nombre: "Kumashape III",
    categoria: "corporal",
    resumen: "Celulitis y flacidez con succión, radiofrecuencia y masaje.",
    descripcion: "Tecnología combinada para tratar celulitis y flacidez corporal.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "endospheres",
    nombre: "Endospheres",
    categoria: "corporal",
    resumen: "Microcompresión y vibración para drenar, tonificar y moldear.",
    descripcion: "Terapia de microvibración compresiva que activa la circulación, drena y tonifica.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "body-therm",
    nombre: "Body Therm",
    categoria: "corporal",
    resumen: "Moldea, reafirma y consiente tu cuerpo.",
    descripcion: "Tratamiento térmico corporal para moldear y reafirmar.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "slim-beauty",
    nombre: "Slim Beauty",
    categoria: "corporal",
    resumen: "30.000 contracciones musculares en 20 minutos.",
    descripcion: "Electroestimulación de alta intensidad: tonifica y fortalece el músculo en sesiones cortas.",
    duracionMin: 30,
    sedes: AMBAS,
  },
  {
    slug: "emsculpt-tensamax",
    nombre: "Emsculpt · Tensamax",
    categoria: "corporal",
    resumen: "Tonificación muscular y firmeza sin esfuerzo.",
    descripcion: "Tecnologías de contracción muscular supramáxima para definir abdomen, glúteos y brazos.",
    duracionMin: 30,
    sedes: AMBAS,
  },
  {
    slug: "drenaje-linfatico",
    nombre: "Drenaje linfático manual",
    categoria: "corporal",
    resumen: "Desinflamar, depurar y acelerar la recuperación.",
    descripcion: "Masaje de drenaje linfático manual, clave en el postoperatorio y en tratamientos reductores.",
    duracionMin: 60,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "acompanamiento-postoperatorio",
    nombre: "Acompañamiento postoperatorio",
    categoria: "corporal",
    resumen: "El puente con la clínica: drenajes, Ultra Z, hiperbárica y seguimiento.",
    descripcion: "Protocolo de recuperación tras cirugía: drenaje linfático, Ultra Z, cámara hiperbárica y control de la evolución.",
    duracionMin: 60,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "ultra-z",
    nombre: "Ultra Z",
    categoria: "corporal",
    resumen: "Retracción de la piel en el postquirúrgico.",
    descripcion: "Ultrasonido que favorece la retracción de la piel y suaviza fibrosis tras la cirugía.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "lipolaser",
    nombre: "Lipoláser",
    categoria: "corporal",
    resumen: "Reducción localizada con láser de baja intensidad.",
    descripcion: "Láser de baja intensidad para reducción de medidas localizada.",
    duracionMin: 45,
    sedes: AMBAS,
    verificar: true,
  },
  {
    slug: "depilacion-laser",
    nombre: "Depilación láser",
    categoria: "corporal",
    resumen: "Láser de diodo para una piel libre de vello.",
    descripcion: "Depilación con láser de diodo, por zonas, en sesiones programadas.",
    duracionMin: 45,
    sedes: AMBAS,
    verificar: true,
  },

  /* ---------- Spa y bienestar ---------- */
  {
    slug: "dia-de-spa",
    nombre: "Día de spa",
    categoria: "spa",
    resumen: "Masaje relajante, exfoliación, chocolaterapia, jacuzzi aromático y refrigerio.",
    descripcion: "Un día entero para ti: masaje relajante completo, exfoliación, chocolaterapia, jacuzzi aromático (Aguachica), refrigerio y decoración.",
    duracionMin: 240,
    sedes: AMBAS,
    destacado: true,
  },
  {
    slug: "experiencia-en-pareja",
    nombre: "Experiencia en pareja",
    categoria: "spa",
    resumen: "El día de spa para dos, pensado como regalo.",
    descripcion: "El mismo recorrido del día de spa, compartido. Ideal para aniversarios y fechas especiales.",
    duracionMin: 240,
    sedes: AMBAS,
  },
  {
    slug: "masaje-relajante",
    nombre: "Masaje relajante",
    categoria: "spa",
    resumen: "Cuerpo completo, aromas y silencio.",
    descripcion: "Masaje relajante de cuerpo completo con aceites y aromaterapia.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "exfoliacion-corporal",
    nombre: "Exfoliación corporal",
    categoria: "spa",
    resumen: "Piel renovada y suave.",
    descripcion: "Exfoliación corporal completa que renueva y suaviza la piel.",
    duracionMin: 45,
    sedes: AMBAS,
  },
  {
    slug: "chocolaterapia",
    nombre: "Chocolaterapia",
    categoria: "spa",
    resumen: "Envoltura de chocolate: nutrición y placer.",
    descripcion: "Envoltura corporal de chocolate que nutre, hidrata y relaja.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "jacuzzi-aromatico",
    nombre: "Jacuzzi aromático",
    categoria: "spa",
    resumen: "Agua caliente, pétalos y velas. Solo en Aguachica.",
    descripcion: "Baño de hidromasaje con aromas, pétalos y velas.",
    duracionMin: 45,
    sedes: AGUACHICA,
  },
  {
    slug: "camara-hiperbarica",
    nombre: "Cámara hiperbárica",
    categoria: "spa",
    resumen: "Oxígeno puro para recuperar, desinflamar y renovar. Solo en Aguachica.",
    descripcion: "Sesiones de oxigenación hiperbárica: aceleran la recuperación de tejidos, reducen la inflamación y aumentan la energía. Clave en el postoperatorio.",
    duracionMin: 60,
    sedes: AGUACHICA,
    destacado: true,
  },
  {
    slug: "bano-turco",
    nombre: "Baño turco",
    categoria: "spa",
    resumen: "Vapor que abre la piel y suelta el cuerpo. Solo en Aguachica.",
    descripcion: "Baño de vapor que relaja, depura y prepara la piel para otros tratamientos.",
    duracionMin: 30,
    sedes: AGUACHICA,
    verificar: true,
  },
  {
    slug: "spa-infantil",
    nombre: "Spa infantil y cumpleaños",
    categoria: "spa",
    resumen: "Peinados, uñas, masaje, chocolaterapia, jacuzzi y decoración para celebrar.",
    descripcion: "Celebraciones con spa para niñas y niños: peinados, uñas, masaje, chocolaterapia, jacuzzi y decoración temática. Se cotiza por WhatsApp.",
    duracionMin: 180,
    sedes: AMBAS,
    soloWhatsApp: true,
  },

  /* ---------- Cejas, pestañas y belleza ---------- */
  {
    slug: "diseno-de-cejas",
    nombre: "Diseño de cejas",
    categoria: "belleza",
    resumen: "Brows & Lash by Ana Cure: la forma que enmarca tu mirada.",
    descripcion: "Diseño y perfilado de cejas a medida de tu rostro.",
    duracionMin: 45,
    sedes: EL_BANCO,
  },
  {
    slug: "microblading",
    nombre: "Microblading y micropigmentación",
    categoria: "belleza",
    resumen: "Cejas definidas pelo a pelo, con resultado natural.",
    descripcion: "Micropigmentación de cejas con técnica pelo a pelo o sombreado.",
    duracionMin: 120,
    sedes: EL_BANCO,
  },
  {
    slug: "pestanas",
    nombre: "Extensiones y lifting de pestañas",
    categoria: "belleza",
    resumen: "Mirada abierta, sin máscara.",
    descripcion: "Extensiones y lifting de pestañas para una mirada abierta y natural.",
    duracionMin: 90,
    sedes: EL_BANCO,
  },
  {
    slug: "maquillaje",
    nombre: "Maquillaje",
    categoria: "belleza",
    resumen: "Para eventos y ocasiones especiales.",
    descripcion: "Maquillaje profesional para eventos.",
    duracionMin: 60,
    sedes: AMBAS,
    verificar: true,
  },
  {
    slug: "manicure-pedicure",
    nombre: "Manicure y pedicure",
    categoria: "belleza",
    resumen: "Manos y pies cuidados, dentro de tus paquetes de spa.",
    descripcion: "Manicure y pedicure, disponibles dentro de los paquetes de spa y celebraciones.",
    duracionMin: 60,
    sedes: AMBAS,
  },
  {
    slug: "peinados",
    nombre: "Peinados",
    categoria: "belleza",
    resumen: "Para cerrar tu día de spa o tu celebración.",
    descripcion: "Peinados para eventos, dentro de los paquetes de spa y celebraciones.",
    duracionMin: 45,
    sedes: AMBAS,
  },
];

export function serviciosDe(categoria: CategoriaSlug): Servicio[] {
  return SERVICIOS.filter((s) => s.categoria === categoria && !s.slug.startsWith("valoracion"));
}

export function servicioPorSlug(slug: string): Servicio | undefined {
  return SERVICIOS.find((s) => s.slug === slug);
}

/* ---------- Menú desplegable de la cabecera ---------- */

export interface ServicioMenu {
  slug: string;
  nombre: string;
}

export interface CategoriaMenu {
  slug: CategoriaSlug;
  corto: string;
  /** Servicios de la categoría en /servicios */
  total: number;
  servicios: ServicioMenu[];
}

/**
 * Versión ligera del catálogo para el menú de la cabecera: por categoría, los destacados primero
 * y hasta `porCategoria` servicios (las valoraciones tienen su propia tarjeta en el menú).
 * Se calcula en el servidor (app/layout.tsx) para que las descripciones de los servicios
 * no viajen en el JavaScript de todas las páginas.
 */
export function menuServicios(porCategoria = 5): CategoriaMenu[] {
  return CATEGORIAS.map((c) => {
    const todos = SERVICIOS.filter((s) => s.categoria === c.slug);
    const elegibles = todos.filter((s) => !s.slug.startsWith("valoracion"));
    const ordenados = [...elegibles.filter((s) => s.destacado), ...elegibles.filter((s) => !s.destacado)];
    return {
      slug: c.slug,
      corto: c.corto,
      total: todos.length,
      servicios: ordenados.slice(0, porCategoria).map(({ slug, nombre }) => ({ slug, nombre })),
    };
  });
}
