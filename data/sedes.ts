export type SedeSlug = "el-banco" | "aguachica";

export interface Sede {
  slug: SedeSlug;
  nombre: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  barrio?: string;
  /** Número en formato internacional sin «+», listo para wa.me */
  whatsapp: string;
  whatsappBonito: string;
  telefonoInternacional: string;
  mapsUrl: string;
  /** Servicios que solo existen en esta sede */
  exclusivos: string[];
  descripcion: string;
}

export const SEDES: Record<SedeSlug, Sede> = {
  "el-banco": {
    slug: "el-banco",
    nombre: "El Banco",
    ciudad: "El Banco",
    departamento: "Magdalena",
    direccion: "Cra 10 # 3-84",
    barrio: "Barrio San Francisco",
    whatsapp: "573045353848",
    whatsappBonito: "304 535 3848",
    telefonoInternacional: "+57 304 535 3848",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Ana Cure Estética y Spa, Cra 10 # 3-84, El Banco, Magdalena"),
    exclusivos: ["Brows & Lash (cejas y pestañas)"],
    descripcion: "La sede original, renovada en 2025, en el barrio San Francisco.",
  },
  aguachica: {
    slug: "aguachica",
    nombre: "Aguachica",
    ciudad: "Aguachica",
    departamento: "Cesar",
    direccion: "Cra 33 # 3-27",
    whatsapp: "573023803267",
    whatsappBonito: "302 380 3267",
    telefonoInternacional: "+57 302 380 3267",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Ana Cure Estética y Spa, Cra 33 # 3-27, Aguachica, Cesar"),
    exclusivos: ["Cámara hiperbárica", "Jacuzzi aromático", "Baño turco"],
    descripcion: "Spa y clínica en un mismo edificio: la clínica en el primer piso.",
  },
};

export const LISTA_SEDES: Sede[] = [SEDES["el-banco"], SEDES.aguachica];

export function esSede(valor: unknown): valor is SedeSlug {
  return valor === "el-banco" || valor === "aguachica";
}

/** Horario confirmado por Ana Cure el 14 de septiembre de 2026. Igual en las dos sedes, jornada continua. */
export const HORARIO = {
  lunesViernes: "7:30 a. m. – 6:00 p. m.",
  sabados: "8:00 a. m. – 3:00 p. m.",
  domingosFestivos: "Cerrado",
  /** Para schema.org y Easy!Appointments */
  estructurado: [
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "07:30", cierra: "18:00" },
    { dias: ["Saturday"], abre: "08:00", cierra: "15:00" },
  ],
} as const;
