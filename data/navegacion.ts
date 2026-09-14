export interface EnlaceNav {
  etiqueta: string;
  href: string;
}

export const NAV_PRINCIPAL: EnlaceNav[] = [
  { etiqueta: "Servicios", href: "/#servicios" },
  { etiqueta: "La experiencia", href: "/#experiencia" },
  { etiqueta: "Productos", href: "/#productos" },
  { etiqueta: "Historias", href: "/#historias" },
  { etiqueta: "Sedes", href: "/#sedes" },
];

export const NAV_LEGAL: EnlaceNav[] = [
  { etiqueta: "Política de privacidad y tratamiento de datos", href: "/privacidad" },
];
