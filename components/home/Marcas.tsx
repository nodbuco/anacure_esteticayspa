import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha } from "@/components/ui/Icons";
import { MARCAS } from "@/data/home";

export function Marcas() {
  return (
    <section id="productos" data-scene="productos" className="relative z-10 bg-blanco py-section">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="revelar">
            <Eyebrow>Dermocosmética</Eyebrow>
            <Heading tamano="lg" className="mt-4">
              Lo que usamos en cabina, también en tu casa
            </Heading>
            <p className="prosa mt-5 text-lead text-gris">
              Trabajamos con marcas que respaldan cada protocolo con ciencia. En septiembre de 2026 las presentamos a nuestras pacientes en una noche en el Hotel Panorama de El Banco.
            </p>
            <ul className="mt-8 divide-y divide-linea border-y border-linea">
              {MARCAS.map((m) => (
                <li key={m.nombre} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <span className="titular text-[0.8rem] tracking-[0.14em] text-tinta">{m.nombre}</span>
                  <span className="text-sm text-gris">
                    <span className="text-tinta-suave">{m.origen}.</span> {m.descripcion}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-gris">Catálogo informativo. Los productos se recomiendan en tu valoración y se adquieren en nuestras sedes.</p>
            <Link href="/productos" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-purpura underline-offset-4 hover:underline">
              Ver productos y marcas <IconoFlecha className="size-4" />
            </Link>
          </div>

          <div className="revelar grid grid-cols-2 gap-4 self-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-soft">
              <Image src="/media/productos/uriage.jpg" alt="Productos Uriage en el evento de dermocosmética de Ana Cure" fill sizes="(min-width: 1024px) 18rem, 45vw" className="object-cover" />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-soft">
              <Image src="/media/productos/cantabria.jpg" alt="Productos Cantabria Labs y Uriage en el evento de Ana Cure" fill sizes="(min-width: 1024px) 18rem, 45vw" className="object-cover" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
