import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoCheck, IconoUbicacion } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { HORARIO, LISTA_SEDES } from "@/data/sedes";
import { SITE } from "@/data/site";

/**
 * Home provisional de la fase a: hero tipográfico y sedes.
 * El fondo 3D llega en la fase b; el resto del recorrido, en la fase c.
 */
export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-lila-50">
        {/* Veladuras de color mientras no está el 3D */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-10 size-[28rem] rounded-full bg-lila-200 blur-3xl" />
          <div className="absolute -right-40 bottom-0 size-[32rem] rounded-full bg-menta-200 blur-3xl" />
        </div>

        <Container className="py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <Eyebrow>Estética avanzada y spa</Eyebrow>
            <Heading nivel={1} tamano="xl" className="mt-5 text-tinta">
              {SITE.frases.hero}
            </Heading>
            <p className="prosa mt-6 text-lead text-gris">
              Medicina estética, tecnología de última generación y un spa para volver a ti. Tu primera cita es una
              valoración sin costo, presencial o virtual.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AgendarButton ubicacion="hero" tamano="lg" />
              <WhatsAppButton ubicacion="hero" tamano="lg" />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gris">
              {["Valoración sin costo", "Presencial o virtual", "Dos sedes"].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <IconoCheck className="size-4 text-verde" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Section tono="blanco" id="sedes">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Sedes</Eyebrow>
            <Heading tamano="lg" className="mt-4">
              Cerca de ti
            </Heading>
            <p className="prosa mt-4 text-gris">
              Lunes a viernes de {HORARIO.lunesViernes} y sábados de {HORARIO.sabados}. Domingos y festivos cerrado.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {LISTA_SEDES.map((s) => (
              <article key={s.slug} className="flex flex-col rounded-card border border-linea bg-lila-50 p-7 shadow-soft sm:p-9">
                <span className="inline-flex items-center gap-2 text-verde">
                  <IconoUbicacion className="size-4" />
                  <span className="titular text-eyebrow">{s.departamento}</span>
                </span>
                <h3 className="titular mt-3 text-display-md">{s.nombre}</h3>
                <p className="mt-2 text-gris">
                  {s.direccion}
                  {s.barrio ? `, ${s.barrio}` : ""}
                </p>
                <p className="mt-4 text-sm text-tinta-suave">{s.descripcion}</p>
                {s.exclusivos.length > 0 && (
                  <p className="mt-3 text-sm text-gris">
                    <span className="font-medium text-tinta">Solo aquí:</span> {s.exclusivos.join(" · ")}
                  </p>
                )}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <AgendarButton sede={s.slug} ubicacion="sedes" />
                  <WhatsAppButton sede={s.slug} ubicacion="sedes" variante="secundario">
                    WhatsApp {s.whatsappBonito}
                  </WhatsAppButton>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
