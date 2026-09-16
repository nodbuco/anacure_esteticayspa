import Link from "next/link";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha, IconoReloj } from "@/components/ui/Icons";
import { CATEGORIAS, serviciosDe } from "@/data/servicios";

export function Servicios() {
  return (
    <section id="servicios" data-scene="servicios" data-flores="suaves" className="relative z-10 py-section">
      <Container>
        <div className="revelar flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Servicios</Eyebrow>
            <Heading tamano="lg" className="mt-4">
              Cada piel tiene su propio protocolo
            </Heading>
            <p className="prosa mt-4 text-lead text-gris">Cinco líneas de tratamiento. Todas empiezan por una valoración sin costo.</p>
          </div>
          <Link href="/servicios" className="inline-flex items-center gap-2 self-start text-sm font-medium text-purpura underline-offset-4 hover:underline md:self-auto">
            Ver el catálogo completo <IconoFlecha className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CATEGORIAS.map((c) => {
            const lista = serviciosDe(c.slug);
            const destacados = [...lista.filter((s) => s.destacado), ...lista.filter((s) => !s.destacado)].slice(0, 5);
            return (
              <article key={c.slug} className="revelar glass flex flex-col rounded-card p-7">
                <Heading nivel={3} tamano="sm" className="text-purpura">
                  {c.nombre}
                </Heading>
                <p className="mt-3 text-sm text-gris">{c.descripcion}</p>
                <ul className="mt-5 divide-y divide-linea/80 border-y border-linea/80">
                  {destacados.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/servicios/${s.slug}`} className="group flex items-center justify-between gap-3 py-2.5 text-[0.95rem] text-tinta transition-colors hover:text-purpura">
                        <span>{s.nombre}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-gris">
                          <IconoReloj className="size-3.5" />
                          {s.duracionMin} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Link href={`/servicios#${c.slug}`} className="text-sm font-medium text-tinta-suave underline-offset-4 hover:text-purpura hover:underline">
                    {lista.length} servicios
                  </Link>
                  <AgendarButton ubicacion={`servicios-${c.slug}`} tamano="md" variante="secundario">
                    Agendar
                  </AgendarButton>
                </div>
              </article>
            );
          })}

          {/* Tarjeta de valoración */}
          <article className="revelar flex flex-col justify-between rounded-card bg-purpura p-7 text-blanco shadow-float">
            <div>
              <Eyebrow tono="claro">Primer paso</Eyebrow>
              <Heading nivel={3} tamano="md" className="mt-3">
                Valoración sin costo
              </Heading>
              <p className="mt-4 text-blanco/85">
                Presencial o virtual. Escuchamos tu caso y diseñamos un plan a tu medida, sin compromiso. Convenio FOMAG vigente para docentes afiliados.
              </p>
            </div>
            <div className="mt-8">
              <AgendarButton ubicacion="servicios-valoracion" variante="inverso" tamano="lg" className="w-full" />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
