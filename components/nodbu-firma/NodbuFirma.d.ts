import type { CSSProperties, ReactElement } from 'react';

export interface NodbuFirmaProps {
  /** Texto antes de la marca. Por defecto «Desarrollado por». */
  texto?: string;
  /** "en" muestra «Built by NODBU». */
  lang?: string;
  /** Fuerza negro ("claro") o blanco ("oscuro"). Por defecto hereda el color del pie. */
  fondo?: 'claro' | 'oscuro';
  /** Punto del color del texto, sin naranja. */
  mono?: boolean;
  /** Sin latido continuo. */
  quieto?: boolean;
  /** Añade rel="nofollow". */
  nofollow?: boolean;
  /** Tamaño de letra: 14 o "0.875rem". Por defecto 13px. */
  tamano?: number | string;
  className?: string;
  style?: CSSProperties;
}

declare function NodbuFirma(props: NodbuFirmaProps): ReactElement;
export default NodbuFirma;
