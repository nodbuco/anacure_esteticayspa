import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoExterno, IconoInstagram } from "@/components/ui/Icons";
import { HISTORIAS } from "@/data/home";

export function Historias() {
  const [principal, ...resto] = HISTORIAS;
  return (
    <section id="historias" data-scene="historias" data-flores="suaves" className="relative z-10 py-section">
      <Container>
        <div className="revelar max-w-2xl">
          <Eyebrow>Historias reales</Eyebrow>
          <Heading tamano="lg" className="mt-4">
            Lo que cuentan quienes ya vinieron
          </Heading>
          <p className="prosa mt-4 text-lead text-gris">
            Testimonios publicados en nuestro Instagram, con la autorización de cada paciente. Cada caso es único y requiere valoración profesional.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          <a
            href={principal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="revelar group relative block overflow-hidden rounded-[2rem] bg-noche shadow-float"
            aria-label={`${principal.titulo}: ver la historia en Instagram`}
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5]">
              <Image src={principal.imagen!} alt={principal.alt} fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover object-center transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/35 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 text-blanco sm:p-9">
              <span className="titular text-[0.7rem] tracking-[0.22em] text-lila-300">{principal.fecha} · Instagram</span>
              <p className="titular mt-2 text-display-md">{principal.titulo}</p>
              <p className="prosa mt-3 text-blanco/85">«{principal.cita}»</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blanco">
                <span className="grid size-10 place-items-center rounded-full bg-blanco/15 ring-1 ring-blanco/30 backdrop-blur">
                  <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </span>
                Ver la serie completa
              </span>
            </div>
          </a>

          <div className="grid gap-4">
            {resto.map((h) => (
              <blockquote key={h.slug} className="revelar glass flex flex-col rounded-card p-6 sm:p-7">
                <p className="titular text-[0.68rem] tracking-[0.2em] text-verde">{h.fecha}</p>
                <p className="mt-3 text-lg leading-snug text-tinta">«{h.cita}»</p>
                <footer className="mt-4 flex items-end justify-between gap-4 text-sm text-gris">
                  <span>
                    <span className="font-medium text-tinta-suave">{h.titulo}.</span> {h.contexto}
                  </span>
                  <a href={h.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-purpura hover:underline" aria-label={`Ver ${h.titulo} en Instagram`}>
                    <IconoInstagram className="size-4" />
                    <IconoExterno className="size-3.5" />
                  </a>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
