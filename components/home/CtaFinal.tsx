import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

export function CtaFinal() {
  return (
    <section data-scene="cierre" className="relative z-10 overflow-hidden bg-noche py-section text-blanco">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_50%,rgb(131_35_171/0.35),transparent_70%),radial-gradient(40%_50%_at_10%_90%,rgb(20_123_128/0.3),transparent_70%)]" />
      <Container className="relative flex flex-col items-center text-center">
        <Logo version="isotipo" color="blanco" className="revelar h-16" />
        <Eyebrow tono="claro" className="revelar mt-8">
          Empecemos
        </Eyebrow>
        <Heading tamano="xl" className="revelar mt-4 max-w-4xl">
          Tu piel tiene su propio protocolo
        </Heading>
        <p className="revelar prosa mt-6 text-lead text-blanco/80">
          Agenda tu valoración sin costo, presencial o virtual, en El Banco o en Aguachica. Te respondemos el mismo día.
        </p>
        <div className="revelar mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <AgendarButton ubicacion="cierre" variante="inverso" tamano="lg" className="w-full sm:w-auto" />
          <WhatsAppButton ubicacion="cierre" tamano="lg" className="w-full sm:w-auto" />
        </div>
      </Container>
    </section>
  );
}
