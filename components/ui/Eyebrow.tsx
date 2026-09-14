import { cn } from "@/lib/cn";

/** Antetítulo pequeño en Cinzel con tracking amplio. */
interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tono?: "verde" | "purpura" | "claro";
}

export function Eyebrow({ className, children, tono = "verde", ...rest }: EyebrowProps) {
  const color = tono === "verde" ? "text-verde" : tono === "purpura" ? "text-purpura" : "text-lila-300";
  return (
    <p className={cn("titular text-eyebrow", color, className)} {...rest}>
      {children}
    </p>
  );
}
