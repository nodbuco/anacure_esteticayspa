import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoUbicacion } from "@/components/ui/Icons";
import { HORARIO, LISTA_SEDES } from "@/data/sedes";

export function Sedes() {
  return (
    <section id="sedes" data-scene="sedes" className="relative z-10 py-section">
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
            <article key={s.slug} className="glass flex flex-col rounded-card p-7 sm:p-9">
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
    </section>
  );
}
