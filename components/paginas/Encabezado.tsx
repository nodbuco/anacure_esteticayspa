import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha } from "@/components/ui/Icons";

interface Miga {
  etiqueta: string;
  href: string;
}

interface Props {
  eyebrow: string;
  titulo: React.ReactNode;
  texto?: React.ReactNode;
  migas?: Miga[];
  children?: React.ReactNode;
  ancho?: "normal" | "amplio";
}

/** Cabecera de subpágina: migas, antetítulo, titular y entradilla, sobre el fondo de la página. */
export function Encabezado({ eyebrow, titulo, texto, migas, children, ancho = "normal" }: Props) {
  return (
    <header className="relative z-10 pb-10 pt-12 sm:pt-16 lg:pb-14 lg:pt-20">
      <Container>
        {migas && migas.length > 0 && (
          <nav aria-label="Ruta" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gris">
            <Link href="/" className="hover:text-purpura">
              Inicio
            </Link>
            {migas.map((m) => (
              <span key={m.href} className="inline-flex items-center gap-2">
                <IconoFlecha className="size-3.5 opacity-60" />
                <Link href={m.href} className="hover:text-purpura">
                  {m.etiqueta}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className={ancho === "amplio" ? "max-w-4xl" : "max-w-3xl"}>
          <Eyebrow className="entrada-aparecer">{eyebrow}</Eyebrow>
          <Heading nivel={1} tamano="lg" className="entrada-subir mt-4">
            {titulo}
          </Heading>
          {texto && (
            <p className="entrada-aparecer prosa mt-5 text-lead text-gris" style={{ "--retraso": "0.2s" } as React.CSSProperties}>
              {texto}
            </p>
          )}
          {children}
        </div>
      </Container>
    </header>
  );
}
