import type { Metadata } from "next";
import Link from "next/link";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha, IconoReloj, IconoUbicacion } from "@/components/ui/Icons";
import { CATEGORIAS, serviciosDe } from "@/data/servicios";
import { SEDES } from "@/data/sedes";

export const metadata: Metadata = {
  title: "Servicios y tratamientos",
  description:
    "Facial y salud de la piel, medicina estética, corporal y moldeamiento, spa y bienestar, cejas y pestañas. Todos los tratamientos de Ana Cure en El Banco y Aguachica.",
};

export default function ServiciosPage() {
  return (
    <main className="relative">
      <FondoSuave />
      <Encabezado
        eyebrow="Servicios"
        titulo="Cada piel tiene su propio protocolo"
        texto="Cinco líneas de tratamiento y una sola puerta de entrada: la valoración sin costo, presencial o virtual."
      >
        <nav aria-label="Categorías" className="mt-8 flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="glass-chip text-sm font-medium text-tinta-suave transition-colors hover:text-purpura">
              {c.corto}
            </a>
          ))}
        </nav>
      </Encabezado>

      <div className="relative z-10 pb-section">
        <Container className="space-y-20">
          {CATEGORIAS.map((c) => (
            <section key={c.slug} id={c.slug} className="scroll-mt-28">
              <div className="max-w-2xl">
                <Heading tamano="md" className="text-purpura">
                  {c.nombre}
                </Heading>
                <p className="mt-3 text-gris">{c.descripcion}</p>
              </div>
              <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {serviciosDe(c.slug).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/servicios/${s.slug}`} className="glass group flex h-full flex-col rounded-card p-6 transition-transform duration-300 ease-luxe hover:-translate-y-0.5">
                      <span className="titular text-display-sm text-tinta transition-colors group-hover:text-purpura">{s.nombre}</span>
                      <span className="mt-2 flex-1 text-sm text-gris">{s.resumen}</span>
                      <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gris">
                        <span className="inline-flex items-center gap-1">
                          <IconoReloj className="size-3.5" /> {s.duracionMin} min
                        </span>
                        {s.sedes.length === 1 && (
                          <span className="inline-flex items-center gap-1">
                            <IconoUbicacion className="size-3.5" /> Solo en {SEDES[s.sedes[0]].nombre}
                          </span>
                        )}
                        {s.profesional && <span>{s.profesional}</span>}
                        <span className="ml-auto inline-flex items-center gap-1 font-medium text-purpura">
                          Ver <IconoFlecha className="size-3.5" />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-card bg-purpura p-8 text-blanco shadow-float sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <Heading tamano="md">¿No sabes por dónde empezar?</Heading>
                <p className="mt-3 text-blanco/85">
                  Agenda una valoración sin costo. Escuchamos tu caso y te decimos qué tratamiento te conviene y cuál no. Convenio FOMAG vigente para docentes afiliados.
                </p>
              </div>
              <AgendarButton ubicacion="servicios-pie" variante="inverso" tamano="lg" />
            </div>
          </section>
        </Container>
      </div>
    </main>
  );
}
