import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VistaServicio } from "@/components/analytics/VistaServicio";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { IconoCheck, IconoFlecha, IconoReloj, IconoUbicacion } from "@/components/ui/Icons";
import { SEDES } from "@/data/sedes";
import { CATEGORIAS, SERVICIOS, servicioPorSlug, serviciosDe, type CategoriaSlug } from "@/data/servicios";

const IMAGEN_CATEGORIA: Record<CategoriaSlug, { src: string; alt: string }> = {
  facial: { src: "/media/experiencia/facial.jpg", alt: "Cabina facial de Ana Cure con equipo Hydrafacial" },
  "medicina-estetica": { src: "/media/experiencia/valoracion.jpg", alt: "Valoración en Ana Cure" },
  corporal: { src: "/media/experiencia/valoracion.jpg", alt: "Tratamiento corporal con aparatología en Ana Cure" },
  spa: { src: "/media/experiencia/jacuzzi.jpg", alt: "Jacuzzi aromático de Ana Cure" },
  belleza: { src: "/media/experiencia/detalle.jpg", alt: "Detalle del spa de Ana Cure" },
};

const IMAGEN_SERVICIO: Record<string, { src: string; alt: string }> = {
  "camara-hiperbarica": { src: "/media/insignias/hiperbarica.jpg", alt: "Cámara hiperbárica de Ana Cure en Aguachica" },
  "acompanamiento-postoperatorio": { src: "/media/insignias/hiperbarica.jpg", alt: "Cámara hiperbárica, parte del acompañamiento postoperatorio" },
  "dia-de-spa": { src: "/media/experiencia/jacuzzi.jpg", alt: "Jacuzzi aromático con pétalos y velas" },
  "experiencia-en-pareja": { src: "/media/experiencia/detalle.jpg", alt: "Detalle del día de spa" },
};

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = servicioPorSlug(slug);
  if (!s) return {};
  return { title: s.nombre, description: s.resumen, alternates: { canonical: `/servicios/${s.slug}` } };
}

export default async function ServicioPage(props: PageProps<"/servicios/[slug]">) {
  const { slug } = await props.params;
  const s = servicioPorSlug(slug);
  if (!s) notFound();
  const categoria = CATEGORIAS.find((c) => c.slug === s.categoria)!;
  const imagen = IMAGEN_SERVICIO[s.slug] ?? IMAGEN_CATEGORIA[s.categoria];
  const relacionados = serviciosDe(s.categoria).filter((r) => r.slug !== s.slug).slice(0, 4);
  const unicaSede = s.sedes.length === 1 ? s.sedes[0] : undefined;

  return (
    <main className="relative">
      <VistaServicio servicio={s.slug} categoria={s.categoria} />
      <FondoSuave />
      <Encabezado
        eyebrow={categoria.nombre}
        titulo={s.nombre}
        texto={s.resumen}
        migas={[
          { etiqueta: "Servicios", href: "/servicios" },
          { etiqueta: categoria.corto, href: `/servicios#${categoria.slug}` },
        ]}
      />

      <div className="relative z-10 pb-section">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft">
              <Image src={imagen.src} alt={imagen.alt} fill priority sizes="(min-width: 1024px) 40rem, 92vw" className="object-cover" />
            </div>
            <div className="prosa mt-10">
              <Heading tamano="md">En qué consiste</Heading>
              <p className="mt-4 text-lead text-gris">{s.descripcion}</p>
              {s.profesional && (
                <p className="mt-4 text-gris">
                  Lo realiza <span className="font-medium text-tinta">{s.profesional}</span>.
                </p>
              )}
            </div>

            <div className="mt-12">
              <Heading tamano="sm">Cómo es tu primera cita</Heading>
              <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["Valoración", "Sin costo, presencial o virtual. Escuchamos tu caso y evaluamos tu piel o tu cuerpo."],
                  ["Protocolo", "Te proponemos el plan: sesiones, tiempos y cuidados en casa. Sin compromiso."],
                  ["Seguimiento", "Después de cada sesión revisamos tu evolución y ajustamos lo que haga falta."],
                ].map(([t, d], i) => (
                  <li key={t} className="glass rounded-2xl p-5">
                    <span className="titular text-[0.7rem] tracking-[0.2em] text-purpura">0{i + 1}</span>
                    <p className="titular mt-2 text-display-sm">{t}</p>
                    <p className="mt-2 text-sm text-gris">{d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-card p-7 sm:p-8">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="flex items-center gap-3 text-gris">
                    <IconoReloj className="size-5 shrink-0 text-verde" />
                    Duración aproximada
                  </dt>
                    <dd className="pl-8 font-medium text-tinta">{s.duracionMin} minutos</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-3 text-gris">
                    <IconoUbicacion className="size-5 shrink-0 text-verde" />
                    Disponible en
                  </dt>
                    <dd className="pl-8 flex flex-wrap gap-x-3 font-medium text-tinta">
                      {s.sedes.map((sede) => (
                        <Link key={sede} href={`/sedes/${sede}`} className="underline-offset-4 hover:text-purpura hover:underline">
                          {SEDES[sede].nombre}
                        </Link>
                      ))}
                    </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-3 text-gris">
                    <IconoCheck className="size-5 shrink-0 text-verde" />
                    Primera cita
                  </dt>
                    <dd className="pl-8 font-medium text-tinta">Valoración sin costo</dd>
                </div>
              </dl>
              <div className="mt-7 flex flex-col gap-3">
                {s.soloWhatsApp ? (
                  <p className="text-sm text-gris">Este servicio se cotiza y reserva por WhatsApp.</p>
                ) : (
                  <AgendarButton ubicacion={`servicio-${s.slug}`} servicio={s.slug} sede={unicaSede} tamano="lg" className="w-full" />
                )}
                <WhatsAppButton ubicacion={`servicio-${s.slug}`} servicio={s.nombre} sede={unicaSede} variante={s.soloWhatsApp ? "whatsapp" : "secundario"} tamano="lg" className="w-full">
                  {s.soloWhatsApp ? "Cotizar por WhatsApp" : "Preguntar por WhatsApp"}
                </WhatsAppButton>
              </div>
            </div>

            {relacionados.length > 0 && (
              <div className="mt-8">
                <p className="titular text-eyebrow text-verde">También en {categoria.corto.toLowerCase()}</p>
                <ul className="mt-4 divide-y divide-linea border-y border-linea">
                  {relacionados.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/servicios/${r.slug}`} className="group flex items-center justify-between gap-3 py-3 text-[0.95rem] text-tinta transition-colors hover:text-purpura">
                        <span>{r.nombre}</span>
                        <IconoFlecha className="size-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </Container>
      </div>
    </main>
  );
}
