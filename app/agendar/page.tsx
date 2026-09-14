import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoUbicacion } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { esSede, LISTA_SEDES } from "@/data/sedes";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Agenda tu valoración",
  description: "Agenda tu valoración sin costo en Ana Cure Estética & Spa, en El Banco o en Aguachica.",
};

/** Fase 1 provisional: elección de sede y confirmación por WhatsApp. La agenda en línea llega en la fase e. */
export default async function AgendarPage(props: PageProps<"/agendar">) {
  const { sede, servicio } = await props.searchParams;
  const sedeElegida = esSede(sede) ? sede : null;
  const servicioTexto = typeof servicio === "string" ? servicio : undefined;

  return (
    <main>
      <Section tono="claro">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Agenda</Eyebrow>
            <Heading nivel={1} tamano="lg" className="mt-4">
              Agenda tu valoración
            </Heading>
            <p className="prosa mt-4 text-lead text-gris">
              Es sin costo y puede ser presencial o virtual. Elige tu sede y te respondemos por WhatsApp.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {LISTA_SEDES.map((s) => {
              const activa = s.slug === sedeElegida;
              return (
                <article
                  key={s.slug}
                  className={cn(
                    "rounded-card border bg-blanco p-7 shadow-soft transition-colors sm:p-9",
                    activa ? "border-purpura ring-2 ring-purpura/20" : "border-linea",
                  )}
                >
                  <span className="inline-flex items-center gap-2 text-verde">
                    <IconoUbicacion className="size-4" />
                    <span className="titular text-eyebrow">{s.departamento}</span>
                  </span>
                  <h2 className="titular mt-3 text-display-md">{s.nombre}</h2>
                  <p className="mt-2 text-gris">
                    {s.direccion}
                    {s.barrio ? `, ${s.barrio}` : ""}
                  </p>
                  <div className="mt-7">
                    <WhatsAppButton sede={s.slug} ubicacion="agendar" tamano="lg" servicio={servicioTexto} className="w-full sm:w-auto">
                      Agendar por WhatsApp
                    </WhatsAppButton>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}
