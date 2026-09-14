import Image from "next/image";
import Link from "next/link";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha } from "@/components/ui/Icons";
import { INSIGNIAS } from "@/data/home";
import { servicioPorSlug } from "@/data/servicios";
import { AntesDespues } from "./AntesDespues";

export function Insignias() {
  return (
    <section id="insignias" data-scene="insignias" className="relative z-10 py-section">
      <Container>
        <div className="revelar max-w-2xl">
          <Eyebrow>En qué somos mejores</Eyebrow>
          <Heading tamano="lg" className="mt-4">
            Cuatro razones para venir
          </Heading>
          <p className="prosa mt-4 text-lead text-gris">
            Diez años de historias reales, contadas con resultados. Arrastra los comparadores.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {INSIGNIAS.map((ins, i) => {
            const invertido = i % 2 === 1;
            return (
              <article key={ins.slug} className="revelar grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={invertido ? "lg:order-2" : ""}>
                  {ins.antes && ins.despues ? (
                    <AntesDespues antes={ins.antes} despues={ins.despues} alt={ins.alt} className="mx-auto max-w-[30rem]" />
                  ) : (
                    <div className="relative mx-auto aspect-[4/3] max-w-[34rem] overflow-hidden rounded-[2rem] shadow-soft">
                      <Image src={ins.imagen!} alt={ins.alt} fill sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
                    </div>
                  )}
                </div>
                <div className={invertido ? "lg:order-1" : ""}>
                  <Eyebrow>{ins.eyebrow}</Eyebrow>
                  <Heading nivel={3} tamano="md" className="mt-4">
                    {ins.titulo}
                  </Heading>
                  <p className="prosa mt-5 text-gris">{ins.texto}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {ins.servicios.map((slug) => {
                      const s = servicioPorSlug(slug);
                      if (!s) return null;
                      return (
                        <li key={slug}>
                          <Link href={`/servicios/${slug}`} className="glass-chip inline-flex items-center gap-1.5 text-sm text-tinta-suave transition-colors hover:text-purpura">
                            {s.nombre}
                            <IconoFlecha className="size-3.5" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-8">
                    <AgendarButton ubicacion={`insignia-${ins.slug}`} servicio={ins.servicios[0]} sede={ins.soloEn}>
                      {ins.cta}
                    </AgendarButton>
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
