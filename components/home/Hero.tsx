import Image from "next/image";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoCheck } from "@/components/ui/Icons";
import { SITE } from "@/data/site";
import heroFoto from "@/public/media/hero/ana-cure.jpg";

const VENTAJAS = ["Valoración sin costo", "Presencial o virtual", "El Banco y Aguachica"];

const retraso = (s: number) => ({ "--retraso": `${s}s` }) as React.CSSProperties;

/**
 * Hero. La animación de entrada es CSS puro (clases .entrada-*): arranca en el primer
 * pintado, no necesita JavaScript y respeta prefers-reduced-motion. El titular solo se
 * desplaza (nunca opacidad 0) porque es el elemento LCP.
 */
export function Hero() {
  return (
    <section data-scene="hero" className="relative z-10 overflow-hidden" aria-labelledby="hero-titulo">
      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24 xl:py-28">
        <div className="max-w-2xl">
          <Eyebrow className="entrada-aparecer" style={retraso(0.05)}>
            Estética avanzada y spa
          </Eyebrow>
          <Heading nivel={1} tamano="xl" id="hero-titulo" className="entrada-subir mt-5 text-tinta">
            {SITE.frases.hero}
          </Heading>
          <p className="entrada-aparecer prosa mt-6 text-lead text-gris" style={retraso(0.25)}>
            Medicina estética, tecnología de última generación y un spa para volver a ti. Tu primera cita es una
            valoración sin costo, presencial o virtual.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="entrada-aparecer" style={retraso(0.4)}>
              <AgendarButton ubicacion="hero" tamano="lg" className="w-full sm:w-auto" />
            </div>
            <div className="entrada-aparecer" style={retraso(0.5)}>
              <WhatsAppButton ubicacion="hero" tamano="lg" className="w-full sm:w-auto" />
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {VENTAJAS.map((t, i) => (
              <li key={t} className="glass-chip entrada-aparecer inline-flex items-center gap-2 text-sm text-tinta-suave" style={retraso(0.65 + i * 0.08)}>
                <IconoCheck className="size-4 text-verde" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative mx-auto w-full max-w-[26rem] lg:max-w-[27rem] lg:justify-self-end">
          <div className="entrada-foto relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-float ring-1 ring-blanco/70">
            <Image
              src={heroFoto}
              alt="La doctora Ana Cure, gerente y cosmetóloga de Ana Cure Estética & Spa"
              fill
              priority
              placeholder="blur"
              quality={75}
              sizes="(min-width: 1024px) 27rem, (min-width: 640px) 26rem, 92vw"
              className="object-cover object-[50%_18%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noche-ciruela/45 via-transparent to-transparent" />
            <figcaption className="glass-oscuro entrada-aparecer absolute inset-x-4 bottom-4 rounded-2xl px-5 py-4" style={retraso(0.9)}>
              <p className="titular text-[0.7rem] tracking-[0.2em] text-lila-300">Dra. Ana Cure</p>
              <p className="mt-1 text-sm leading-snug text-blanco/90">Cosmetóloga con maestría internacional. Gerente y fundadora.</p>
            </figcaption>
          </div>
        </figure>
      </Container>
    </section>
  );
}
