import { cn } from "@/lib/cn";

type Nivel = 1 | 2 | 3 | 4;
type Tamano = "xl" | "lg" | "md" | "sm";

const tamanos: Record<Tamano, string> = {
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
};

interface HeadingProps {
  nivel?: Nivel;
  tamano?: Tamano;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

/** Titular de marca: Cinzel, mayúsculas, tracking según tamaño. */
export function Heading({ nivel = 2, tamano = "lg", className, children, id }: HeadingProps) {
  const Tag = `h${nivel}` as const;
  return (
    <Tag id={id} className={cn("titular", tamanos[tamano], className)}>
      {children}
    </Tag>
  );
}
