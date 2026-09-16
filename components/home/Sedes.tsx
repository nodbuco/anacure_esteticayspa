import Image from "next/image";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoExterno, IconoReloj, IconoUbicacion } from "@/components/ui/Icons";
import { HORARIO, LISTA_SEDES } from "@/data/sedes";
import { MapaSede } from "./MapaSede";

const FOTOS: Record<string, { src: string; alt: string }> = {
  "el-banco": { src: "/media/sedes/el-banco.jpg", alt: "Fachada de Ana Cure Estética & Spa en El Banco, con el equipo en la entrada" },
  aguachica: { src: "/media/sedes/aguachica.jpg", alt: "Recepción de la sede de Aguachica" },
};

export function Sedes() {
  return (
    <section id="sedes" data-scene="sedes" data-flores="suaves" className="relative z-10 py-section">
      <Container>
        <div className="revelar max-w-2xl">
          <Eyebrow>Sedes</Eyebrow>
          <Heading tamano="lg" className="mt-4">
            Cerca de ti
          </Heading>
          <p className="prosa mt-4 text-lead text-gris">Dos sedes, un mismo equipo y el mismo horario. Elige la tuya y escríbenos.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {LISTA_SEDES.map((s) => {
            const foto = FOTOS[s.slug];
            return (
              <article key={s.slug} className="revelar glass flex flex-col overflow-hidden rounded-card">
                <div className="relative aspect-[16/10]">
                  <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-pill bg-blanco/85 px-3 py-1.5 text-verde backdrop-blur">
                    <IconoUbicacion className="size-4" />
                    <span className="titular text-[0.68rem] tracking-[0.2em]">{s.departamento}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <h3 className="titular text-display-md">{s.nombre}</h3>
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-gris underline-offset-4 hover:text-purpura hover:underline">
                    {s.direccion}
                    {s.barrio ? `, ${s.barrio}` : ""} · {s.ciudad}
                    <IconoExterno className="size-3.5" />
                  </a>
                  <p className="mt-4 text-sm text-tinta-suave">{s.descripcion}</p>
                  {s.exclusivos.length > 0 && (
                    <p className="mt-2 text-sm text-gris">
                      <span className="font-medium text-tinta">Solo aquí:</span> {s.exclusivos.join(" · ")}
                    </p>
                  )}
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <dt className="inline-flex items-center gap-1.5 text-gris">
                      <IconoReloj className="size-4" /> Lunes a viernes
                    </dt>
                    <dd className="text-tinta">{HORARIO.lunesViernes}</dd>
                    <dt className="pl-[1.375rem] text-gris">Sábados</dt>
                    <dd className="text-tinta">{HORARIO.sabados}</dd>
                    <dt className="pl-[1.375rem] text-gris">Domingos y festivos</dt>
                    <dd className="text-tinta">{HORARIO.domingosFestivos}</dd>
                  </dl>
                  <div className="mt-6">
                    <MapaSede sede={s} />
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <AgendarButton sede={s.slug} ubicacion="sedes" />
                    <WhatsAppButton sede={s.slug} ubicacion="sedes" variante="secundario">
                      WhatsApp {s.whatsappBonito}
                    </WhatsAppButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
