import type { Metadata } from "next";
import Image from "next/image";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { EQUIPO, HITOS, MARCAS_INSIGNIA, TITULOS } from "@/data/equipo";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Sobre Ana Cure",
  description:
    "La historia de Ana Cure Estética & Spa: de salón de belleza en El Banco a centro de estética avanzada con dos sedes y clínica estética. La Dra. Ana Cure y su equipo.",
};

export default function SobrePage() {
  const visibles = EQUIPO.filter((p) => p.visible);
  return (
    <main className="relative">
      <FondoSuave />
      <Encabezado
        eyebrow="Sobre Ana Cure"
        titulo="Donde el cuidado se convierte en experiencia"
        texto="Diez años cuidando pieles en el sur del Magdalena y el Cesar. Empezamos como salón de belleza y hoy somos un centro de medicina estética que nunca dejó de ser spa."
      />

      <div className="relative z-10 pb-section">
        <Container>
          {/* Ana */}
          <section className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <figure className="relative mx-auto w-full max-w-[24rem]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2.5rem] shadow-float">
                <Image src="/media/sobre/ana-cure-tecnologia.jpg" alt="La doctora Ana Cure junto a los equipos de tecnología del spa" fill priority sizes="(min-width: 1024px) 24rem, 88vw" className="object-cover object-[50%_25%]" />
              </div>
              <figcaption className="mt-4 text-center text-sm text-gris">Dra. Ana Cure con parte de la tecnología del spa, 2025.</figcaption>
            </figure>
            <div>
              <Eyebrow>Fundadora</Eyebrow>
              <Heading tamano="lg" className="mt-4">
                Dra. Ana Cure
              </Heading>
              <p className="prosa mt-5 text-lead text-gris">{EQUIPO[0].descripcion}</p>
              <p className="prosa mt-4 text-gris">
                «{SITE.frases.protocolo}». Esa frase resume su forma de trabajar: escuchar primero, diseñar después y acompañar siempre. Su firma está en cada protocolo, en la elección de cada equipo y en la formación constante del equipo.
              </p>
              {TITULOS.length > 0 && (
                <ul className="mt-6 divide-y divide-linea border-y border-linea">
                  {TITULOS.map((t) => (
                    <li key={t.titulo} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm">
                      <span className="font-medium text-tinta">{t.titulo}</span>
                      <span className="text-gris">
                        {t.institucion}
                        {t.anio ? ` · ${t.anio}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Trayectoria */}
          <section className="mt-24">
            <Eyebrow>Trayectoria</Eyebrow>
            <Heading tamano="lg" className="mt-4">
              De 2015 a hoy
            </Heading>
            <ol className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {HITOS.map((h) => (
                <li key={h.anio} className="glass rounded-card p-6">
                  <span className="titular text-display-md text-purpura">{h.anio}</span>
                  <p className="titular mt-2 text-display-sm">{h.titulo}</p>
                  <p className="mt-2 text-sm text-gris">{h.texto}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Equipo */}
          <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Eyebrow>Equipo</Eyebrow>
              <Heading tamano="lg" className="mt-4">
                Quiénes te atienden
              </Heading>
              <ul className="mt-8 space-y-6">
                {visibles.map((p) => (
                  <li key={p.slug} className="border-l-2 border-purpura pl-5">
                    <p className="titular text-display-sm">{p.nombre}</p>
                    <p className="titular mt-1 text-[0.7rem] tracking-[0.2em] text-verde">{p.rol}</p>
                    <p className="mt-2 text-sm text-gris">{p.descripcion}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gris">Un equipo de cosmetólogas, terapeutas y personal de recepción en cada sede completa la atención.</p>
            </div>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft lg:mt-10">
              <Image src="/media/experiencia/equipo.jpg" alt="Equipo de Ana Cure en la sede de Aguachica" fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
            </figure>
          </section>

          {/* Marcas y tecnologías insignia */}
          {MARCAS_INSIGNIA.length > 0 && (
            <section className="mt-24">
              <Eyebrow>Tecnología insignia</Eyebrow>
              <Heading tamano="lg" className="mt-4">
                Con qué trabajamos
              </Heading>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {MARCAS_INSIGNIA.map((m) => (
                  <li key={m.nombre} className="glass rounded-2xl p-5">
                    <p className="titular text-[0.85rem] tracking-[0.12em] text-tinta">{m.nombre}</p>
                    <p className="mt-1 text-sm text-gris">{m.que}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Clínica */}
          <section className="mt-24 grid items-center gap-8 rounded-card bg-noche p-8 text-blanco sm:p-10 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow tono="claro">Sitio hermano</Eyebrow>
              <Heading tamano="md" className="mt-3">
                Clínica Estética Ana Cure
              </Heading>
              <p className="mt-3 max-w-2xl text-blanco/80">
                En el mismo edificio de Aguachica funciona nuestra clínica de cirugía plástica y dermatología. El recorrido es natural: valoración, procedimiento en la clínica y recuperación en el spa, con drenajes, Ultra Z y cámara hiperbárica.
              </p>
            </div>
            <a href={SITE.urlClinica} className="inline-flex min-h-12 items-center justify-center rounded-pill bg-blanco px-6 font-medium text-tinta transition-colors hover:bg-lila-100">
              Conocer la clínica
            </a>
          </section>

          <div className="mt-16 flex justify-center">
            <AgendarButton ubicacion="sobre" tamano="lg" />
          </div>
        </Container>
      </div>
    </main>
  );
}
