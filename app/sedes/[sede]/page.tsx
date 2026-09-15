import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { FormularioContacto } from "@/components/contacto/FormularioContacto";
import { MapaSede } from "@/components/home/MapaSede";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { IconoExterno, IconoReloj, IconoUbicacion, IconoWhatsApp } from "@/components/ui/Icons";
import { esSede, HORARIO, LISTA_SEDES, SEDES } from "@/data/sedes";
import { CATEGORIAS, SERVICIOS } from "@/data/servicios";
import { jsonLdSede } from "@/lib/seo";

export function generateStaticParams() {
  return LISTA_SEDES.map((s) => ({ sede: s.slug }));
}

export async function generateMetadata(props: PageProps<"/sedes/[sede]">): Promise<Metadata> {
  const { sede } = await props.params;
  if (!esSede(sede)) return {};
  const s = SEDES[sede];
  return {
    title: `Estética y spa en ${s.ciudad}, ${s.departamento}`,
    alternates: { canonical: `/sedes/${s.slug}` },
    description: `Ana Cure Estética & Spa en ${s.ciudad}: ${s.direccion}. Medicina estética, tratamientos faciales y corporales y spa. Valoración sin costo. WhatsApp ${s.whatsappBonito}.`,
  };
}

export default async function SedePage(props: PageProps<"/sedes/[sede]">) {
  const { sede } = await props.params;
  if (!esSede(sede)) notFound();
  const s = SEDES[sede];
  const otra = LISTA_SEDES.find((o) => o.slug !== s.slug)!;
  const disponibles = SERVICIOS.filter((x) => x.sedes.includes(s.slug) && !x.slug.startsWith("valoracion"));

  return (
    <main className="relative">
      <FondoSuave />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSede(s)) }} />
      <Encabezado
        eyebrow={`${s.departamento} · Colombia`}
        titulo={`Ana Cure en ${s.nombre}`}
        texto={s.descripcion}
        migas={[{ etiqueta: "Sedes", href: "/#sedes" }]}
      />

      <div className="relative z-10 pb-section">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft">
              <Image src={`/media/sedes/${s.slug}.jpg`} alt={`Sede de Ana Cure en ${s.ciudad}`} fill priority sizes="(min-width: 1024px) 40rem, 92vw" className="object-cover" />
            </div>
            <div className="mt-8">
              <MapaSede sede={s} />
            </div>

            <div className="mt-12">
              <Heading tamano="md">Qué encuentras en esta sede</Heading>
              {s.exclusivos.length > 0 && (
                <p className="mt-3 text-gris">
                  <span className="font-medium text-tinta">Solo aquí:</span> {s.exclusivos.join(" · ")}
                </p>
              )}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {CATEGORIAS.map((c) => {
                  const lista = disponibles.filter((x) => x.categoria === c.slug);
                  if (lista.length === 0) return null;
                  return (
                    <div key={c.slug}>
                      <p className="titular text-[0.8rem] tracking-[0.14em] text-purpura">{c.nombre}</p>
                      <ul className="mt-2 space-y-1 text-sm text-tinta-suave">
                        {lista.map((x) => (
                          <li key={x.slug}>
                            <Link href={`/servicios/${x.slug}`} className="underline-offset-4 hover:text-purpura hover:underline">
                              {x.nombre}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-card p-7 sm:p-8">
              <address className="space-y-4 text-sm not-italic">
                <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-purpura">
                  <IconoUbicacion className="mt-0.5 size-5 shrink-0 text-verde" />
                  <span>
                    <span className="block font-medium text-tinta">
                      {s.direccion}
                      {s.barrio ? `, ${s.barrio}` : ""}
                    </span>
                    <span className="text-gris">
                      {s.ciudad}, {s.departamento} <IconoExterno className="inline size-3.5" />
                    </span>
                  </span>
                </a>
                <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-purpura">
                  <IconoWhatsApp className="mt-0.5 size-5 shrink-0 text-verde" />
                  <span>
                    <span className="block font-medium text-tinta">{s.whatsappBonito}</span>
                    <span className="text-gris">WhatsApp de la sede</span>
                  </span>
                </a>
                <div className="flex items-start gap-3">
                  <IconoReloj className="mt-0.5 size-5 shrink-0 text-verde" />
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                    <dt className="text-gris">Lunes a viernes</dt>
                    <dd className="font-medium text-tinta">{HORARIO.lunesViernes}</dd>
                    <dt className="text-gris">Sábados</dt>
                    <dd className="font-medium text-tinta">{HORARIO.sabados}</dd>
                    <dt className="text-gris">Domingos y festivos</dt>
                    <dd className="font-medium text-tinta">{HORARIO.domingosFestivos}</dd>
                  </dl>
                </div>
              </address>
              <div className="mt-7 flex flex-col gap-3">
                <AgendarButton sede={s.slug} ubicacion={`sede-${s.slug}`} tamano="lg" className="w-full" />
                <WhatsAppButton sede={s.slug} ubicacion={`sede-${s.slug}`} variante="secundario" tamano="lg" className="w-full" />
              </div>
            </div>
            <div className="mt-6">
              <FormularioContacto sede={s.slug} />
            </div>
            <p className="mt-6 text-sm text-gris">
              ¿Te queda más cerca {otra.nombre}?{" "}
              <Link href={`/sedes/${otra.slug}`} className="font-medium text-purpura underline-offset-4 hover:underline">
                Ver la sede de {otra.nombre}
              </Link>
            </p>
          </aside>
        </Container>
      </div>
    </main>
  );
}
