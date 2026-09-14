import Link from "next/link";
import { cn } from "@/lib/cn";

export type VarianteBoton = "primario" | "whatsapp" | "secundario" | "fantasma" | "inverso";
export type TamanoBoton = "md" | "lg" | "icono";

const base =
  "boton group/boton relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-pill font-sans font-medium tracking-[0.01em] select-none whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 ease-luxe hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-100 disabled:opacity-50 disabled:pointer-events-none";

const variantes: Record<VarianteBoton, string> = {
  primario: "boton-brillo bg-purpura text-blanco shadow-soft hover:bg-ciruela hover:shadow-[0_18px_40px_-14px_rgb(131_35_171/0.55)]",
  whatsapp: "boton-brillo bg-verde text-blanco shadow-soft hover:bg-verde-oscuro hover:shadow-[0_18px_40px_-14px_rgb(20_123_128/0.55)]",
  secundario: "bg-blanco text-purpura ring-1 ring-inset ring-lila-300 hover:bg-lila-100 hover:ring-purpura hover:shadow-soft",
  fantasma: "bg-transparent text-tinta hover:bg-lila-100",
  inverso: "bg-blanco text-purpura shadow-soft hover:bg-lila-100 hover:shadow-float",
};

const tamanos: Record<TamanoBoton, string> = {
  md: "min-h-12 px-6 text-[0.95rem]",
  lg: "min-h-14 px-8 text-base sm:text-[1.05rem]",
  icono: "size-12 p-0",
};

export function estilosBoton(variante: VarianteBoton = "primario", tamano: TamanoBoton = "md", className?: string) {
  return cn(base, variantes[variante], tamanos[tamano], className);
}

interface Comun {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface ComoEnlace extends Comun {
  href: string;
  /** Abre en pestaña nueva con rel seguro */
  externo?: boolean;
  type?: never;
  disabled?: never;
}

interface ComoBoton extends Comun {
  href?: undefined;
  externo?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export type ButtonProps = ComoEnlace | ComoBoton;

/** Botón o enlace con el mismo aspecto. Con `href` renderiza un enlace. */
export function Button(props: ButtonProps) {
  const { variante = "primario", tamano = "md", className, children, onClick, title } = props;
  const ariaLabel = props["aria-label"];
  const clases = estilosBoton(variante, tamano, className);

  if (props.href !== undefined) {
    if (props.externo) {
      return (
        <a href={props.href} className={clases} target="_blank" rel="noopener noreferrer" onClick={onClick} aria-label={ariaLabel} title={title}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={clases} onClick={onClick} aria-label={ariaLabel} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={clases} onClick={onClick} aria-label={ariaLabel} title={title} disabled={props.disabled}>
      {children}
    </button>
  );
}
