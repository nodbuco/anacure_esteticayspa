import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <main>
      <Section tono="claro">
        <Container className="max-w-2xl text-center">
          <Eyebrow>Error 404</Eyebrow>
          <Heading nivel={1} tamano="lg" className="mt-4">
            Esta página no existe
          </Heading>
          <p className="mt-4 text-gris">Puede que el enlace haya cambiado. Vuelve al inicio o escríbenos.</p>
          <div className="mt-8">
            <Button href="/">Ir al inicio</Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
