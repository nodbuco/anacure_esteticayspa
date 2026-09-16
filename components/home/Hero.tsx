import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { IconoCheck } from "@/components/ui/Icons";
import { RetratoHero } from "./RetratoHero";

const retraso = (s: number) => ({ "--retraso": `${s}s` }) as React.CSSProperties;

/**
 * Hero. Entrada en CSS puro (clases .entrada-*): arranca en el primer pintado, sin
 * JavaScript, y respeta prefers-reduced-motion. El titular solo se desplaza (nunca
 * opacidad 0) porque es el elemento LCP. La foto (RetratoHero) va en un arco que se funde
 * con la página por abajo y se revela cuando la imagen ya cargó, nunca a medio pintar.
 * Con la barra de promoción visible, el alto y el margen inferior descuentan --alto-promo:
 * el hero sigue ocupando la misma primera pantalla que sin barra. En portátiles de poca altura
 * (variante pantalla-baja) aprieta márgenes y titular para que los botones sigan a la vista.
 */
export function Hero() {
  return (
    <section
      data-scene="hero"
      data-flores="nitidas"
      aria-labelledby="hero-titulo"
      className="relative z-10 flex min-h-[calc(100svh-4.5rem-var(--alto-promo,0rem))] items-center overflow-hidden lg:min-h-[min(calc(100svh-5rem-var(--alto-promo,0rem)),54rem)]"
    >
      <Container className="grid w-full items-center gap-12 py-12 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-[calc(6rem-var(--alto-promo,0rem))] lg:pt-6">
        <div className="max-w-2xl">
          <p className="entrada-aparecer titular flex items-center gap-4 text-eyebrow text-verde" style={retraso(0.05)}>
            <span aria-hidden="true" className="h-px w-10 bg-verde/70" />
            Estética avanzada &amp; spa
          </p>
          <h1 id="hero-titulo" className="entrada-subir titular mt-6 text-display-xl text-tinta pantalla-baja:mt-4 pantalla-baja:text-[length:min(var(--text-display-xl),9.4svh)]">
            Donde el cuidado se convierte en <span className="text-purpura">experiencia</span>
          </h1>
          <p className="entrada-aparecer prosa mt-7 text-lead text-gris pantalla-baja:mt-5" style={retraso(0.25)}>
            Medicina estética de última generación y un spa hecho para volver a ti, en El Banco y en Aguachica.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center pantalla-baja:mt-7">
            <div className="entrada-aparecer" style={retraso(0.4)}>
              <AgendarButton ubicacion="hero" tamano="lg" className="w-full sm:w-auto" />
            </div>
            <div className="entrada-aparecer" style={retraso(0.5)}>
              <WhatsAppButton ubicacion="hero" tamano="lg" className="w-full sm:w-auto" />
            </div>
          </div>
          <p className="entrada-aparecer mt-6 inline-flex items-center gap-2 text-sm text-tinta-suave pantalla-baja:mt-4" style={retraso(0.65)}>
            <IconoCheck className="size-4 text-verde" />
            Tu primera cita es una valoración sin costo, presencial o virtual.
          </p>
        </div>

        <RetratoHero />
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
