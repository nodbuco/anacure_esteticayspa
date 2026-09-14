import Image from "next/image";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { IconoCheck } from "@/components/ui/Icons";
import heroFoto from "@/public/media/hero/ana-cure.jpg";

const retraso = (s: number) => ({ "--retraso": `${s}s` }) as React.CSSProperties;

/**
 * Hero. Entrada en CSS puro (clases .entrada-*): arranca en el primer pintado, sin
 * JavaScript, y respeta prefers-reduced-motion. El titular solo se desplaza (nunca
 * opacidad 0) porque es el elemento LCP. La foto va en un arco que se funde con la
 * página por abajo, sin marco, para que las flores y el retrato compartan el mismo aire.
 */
export function Hero() {
  return (
    <section
      data-scene="hero"
      aria-labelledby="hero-titulo"
      className="relative z-10 flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden lg:min-h-[min(calc(100svh-5rem),54rem)]"
    >
      <Container className="grid w-full items-center gap-12 py-12 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-24 lg:pt-6">
        <div className="max-w-2xl">
          <p className="entrada-aparecer titular flex items-center gap-4 text-eyebrow text-verde" style={retraso(0.05)}>
            <span aria-hidden="true" className="h-px w-10 bg-verde/70" />
            Estética avanzada &amp; spa
          </p>
          <h1 id="hero-titulo" className="entrada-subir titular mt-6 text-display-xl text-tinta">
            Donde el cuidado se convierte en <span className="text-purpura">experiencia</span>
          </h1>
          <p className="entrada-aparecer prosa mt-7 text-lead text-gris" style={retraso(0.25)}>
            Medicina estética de última generación y un spa hecho para volver a ti, en El Banco y en Aguachica.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="entrada-aparecer" style={retraso(0.4)}>
              <AgendarButton ubicacion="hero" tamano="lg" className="w-full sm:w-auto" />
            </div>
            <div className="entrada-aparecer" style={retraso(0.5)}>
              <WhatsAppButton ubicacion="hero" tamano="lg" className="w-full sm:w-auto" />
            </div>
          </div>
          <p className="entrada-aparecer mt-6 inline-flex items-center gap-2 text-sm text-tinta-suave" style={retraso(0.65)}>
            <IconoCheck className="size-4 text-verde" />
            Tu primera cita es una valoración sin costo, presencial o virtual.
          </p>
        </div>

        <figure className="relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem] lg:max-w-[28rem] lg:justify-self-end">
          {/* Halo suave detrás del arco: une el retrato con el fondo */}
          <div aria-hidden="true" className="entrada-aparecer absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(235_221_243/0.9),rgb(235_221_243/0.35)_55%,transparent_75%)]" style={retraso(0.3)} />
          {/* Arco exterior fino, ligeramente desplazado */}
          <div aria-hidden="true" className="entrada-aparecer absolute -inset-3 rounded-t-full rounded-b-[3rem] border border-lila-300/80" style={retraso(0.8)} />
          <div className="entrada-foto arco-foto relative aspect-[3/4]">
            <Image
              src={heroFoto}
              alt="La doctora Ana Cure, gerente y cosmetóloga de Ana Cure Estética & Spa"
              fill
              priority
              placeholder="blur"
              quality={78}
              sizes="(min-width: 1024px) 28rem, (min-width: 640px) 26rem, 88vw"
              className="object-cover object-top"
            />
          </div>
          <figcaption className="entrada-aparecer mt-5 flex flex-col gap-1 px-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4" style={retraso(0.9)}>
            <span className="titular whitespace-nowrap text-[0.72rem] tracking-[0.22em] text-purpura">Dra. Ana Cure</span>
            <span className="text-sm text-gris sm:text-right">Cosmetóloga · maestría internacional · fundadora</span>
          </figcaption>
        </figure>
      </Container>

      {/* Indicación de scroll (solo escritorio) */}
      <div aria-hidden="true" className="entrada-aparecer absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex" style={retraso(1.4)}>
        <span className="titular text-[0.6rem] tracking-[0.3em] text-gris">Descubre</span>
        <span className="relative block h-10 w-px overflow-hidden bg-lila-300">
          <span className="scroll-gota absolute left-0 top-0 h-3 w-px bg-purpura" />
        </span>
      </div>
    </section>
  );
}
