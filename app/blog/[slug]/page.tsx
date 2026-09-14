import Markdoc from "@markdoc/markdoc";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha } from "@/components/ui/Icons";
import { CATALOGO, productoPorSlug } from "@/data/productos";
import { CATEGORIAS_BLOG, formatearFecha, listarArticulos, reader } from "@/lib/blog";

export async function generateStaticParams() {
  const articulos = await listarArticulos();
  return articulos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = await reader.collections.articulos.read(slug);
  if (!a || !a.publicado) return {};
  return {
    title: a.titulo,
    description: a.resumen,
    openGraph: a.imagen ? { images: [{ url: a.imagen, alt: a.imagenAlt }] } : undefined,
  };
}

export default async function ArticuloPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const a = await reader.collections.articulos.read(slug);
  if (!a || !a.publicado) notFound();
  const { node } = await a.contenido();
  const contenido = Markdoc.transform(node);
  const productos = a.productos.map(productoPorSlug).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const otros = (await listarArticulos()).filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <main className="relative">
      <FondoSuave />
      <Encabezado
        eyebrow={`${CATEGORIAS_BLOG[a.categoria]} · ${formatearFecha(a.fecha ?? "")}`}
        titulo={a.titulo}
        texto={a.resumen}
        migas={[{ etiqueta: "Blog", href: "/blog" }]}
        ancho="amplio"
      />
      <div className="relative z-10 pb-section">
        <Container>
          {a.imagen && (
            <figure className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-soft">
              <Image src={a.imagen} alt={a.imagenAlt} fill priority sizes="(min-width: 1280px) 76rem, 92vw" className="object-cover" />
            </figure>
          )}
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <article className="articulo prosa text-[1.05rem] leading-relaxed text-tinta-suave">{Markdoc.renderers.react(contenido, React)}</article>
            <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              <div className="glass rounded-card p-6">
                <p className="titular text-eyebrow text-verde">¿Dudas sobre tu piel?</p>
                <p className="mt-3 text-sm text-gris">La primera cita es una valoración sin costo, presencial o virtual.</p>
                <div className="mt-5 flex flex-col gap-3">
                  <AgendarButton ubicacion={`blog-${slug}`} className="w-full" />
                  <WhatsAppButton ubicacion={`blog-${slug}`} variante="secundario" className="w-full" />
                </div>
              </div>
              {productos.length > 0 && (
                <div>
                  <p className="titular text-eyebrow text-verde">Productos relacionados</p>
                  <ul className="mt-4 divide-y divide-linea border-y border-linea">
                    {productos.map((p) => {
                      const marca = CATALOGO.find((m) => m.productos.some((x) => x.slug === p.slug));
                      return (
                        <li key={p.slug} className="py-3">
                          <Link href={`/productos#${marca?.slug ?? ""}`} className="group block">
                            <span className="block font-medium text-tinta transition-colors group-hover:text-purpura">{p.nombre}</span>
                            <span className="block text-sm text-gris">
                              {p.marca} · {p.para}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {otros.length > 0 && (
            <section className="mt-20">
              <Heading tamano="md">Sigue leyendo</Heading>
              <ul className="mt-6 grid gap-4 md:grid-cols-3">
                {otros.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/blog/${o.slug}`} className="glass group flex h-full flex-col rounded-card p-6">
                      <span className="titular text-[0.68rem] tracking-[0.2em] text-verde">{CATEGORIAS_BLOG[o.categoria]}</span>
                      <span className="titular mt-2 text-display-sm transition-colors group-hover:text-purpura">{o.titulo}</span>
                      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-purpura">
                        Leer <IconoFlecha className="size-4" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </div>
    </main>
  );
}
