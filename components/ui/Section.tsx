import { cn } from "@/lib/cn";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tono?: "claro" | "blanco" | "oscuro" | "purpura";
}

const tonos = {
  claro: "bg-lila-50 text-tinta",
  blanco: "bg-blanco text-tinta",
  oscuro: "bg-noche text-blanco",
  purpura: "bg-purpura text-blanco",
};

export function Section({ tono = "claro", className, children, ...rest }: SectionProps) {
  return (
    <section className={cn("py-section", tonos[tono], className)} {...rest}>
      {children}
    </section>
  );
}
