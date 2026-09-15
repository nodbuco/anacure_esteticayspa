import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { IconoFlecha } from "@/components/ui/Icons";
import { CATEGORIAS_BLOG, formatearFecha, listarArticulos } from "@/lib/blog";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog · Consejos para el cuidado de la piel",
  description: "Consejos del equipo de Ana Cure para cuidar tu piel en el clima del Caribe y el Cesar: sol, acné, manchas, hidratación y tratamientos.",
};

export default async function BlogPage() {
  const articulos = await listarArticulos();
  const [principal, ...resto] = articulos;
  return (
    <main className="relative">
      <FondoSuave />
      <Encabezado eyebrow="Blog" titulo="Consejos para tu piel" texto="Lo que le contamos a nuestras pacientes en cabina, escrito para leerlo en casa." />
      <div className="relative z-10 pb-section">
        <Container>
          {principal && (
            <Link href={`/blog/${principal.slug}`} className="glass group grid overflow-hidden rounded-card lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
                {principal.imagen && <Image src={principal.imagen} alt={principal.imagenAlt} fill priority sizes="(min-width: 1024px) 40rem, 92vw" className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.03]" />}
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="titular text-eyebrow text-verde">
                  {CATEGORIAS_BLOG[principal.categoria]} · {formatearFecha(principal.fecha)}
                </p>
                <h2 className="titular mt-4 text-display-md transition-colors group-hover:text-purpura">{principal.titulo}</h2>
                <p className="mt-4 text-gris">{principal.resumen}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-purpura">
                  Leer <IconoFlecha className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )}
          <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resto.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="glass group flex h-full flex-col overflow-hidden rounded-card">
                  <div className="relative aspect-[16/10]">{a.imagen && <Image src={a.imagen} alt={a.imagenAlt} fill sizes="(min-width: 1280px) 24rem, (min-width: 768px) 45vw, 92vw" className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.03]" />}</div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="titular text-[0.68rem] tracking-[0.2em] text-verde">
                      {CATEGORIAS_BLOG[a.categoria]} · {formatearFecha(a.fecha)}
                    </p>
                    <h2 className="titular mt-3 text-display-sm transition-colors group-hover:text-purpura">{a.titulo}</h2>
                    <p className="mt-2 flex-1 text-sm text-gris">{a.resumen}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {articulos.length === 0 && <p className="text-gris">Pronto publicaremos el primer artículo.</p>}
        </Container>
      </div>
    </main>
  );
}
