import type { Metadata } from "next";
import Image from "next/image";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { CATALOGO } from "@/data/productos";

export const metadata: Metadata = {
  alternates: { canonical: "/productos" },
  title: "Productos y marcas",
  description: "Dermocosmética profesional en Ana Cure: ZO Skin Health, Uriage, Cantabria Labs, Heliocare, Medivelius Derma y nuestra línea propia. Catálogo informativo.",
};

export default function ProductosPage() {
  return (
    <main className="relative">
      <FondoSuave />
      <Encabezado
        eyebrow="Productos"
        titulo="Lo que usamos en cabina, también en tu casa"
        texto="Catálogo informativo, sin precios ni venta en línea. En tu valoración te recomendamos lo que tu piel necesita y lo adquieres en nuestras sedes."
      />
      <div className="relative z-10 pb-section">
        <Container className="space-y-16">
          {CATALOGO.map((m, i) => (
            <section key={m.slug} id={m.slug} className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
              <div className={i % 2 === 1 && m.imagen ? "lg:order-2" : ""}>
                <Eyebrow>{m.origen}</Eyebrow>
                <Heading tamano="md" className="mt-3">
                  {m.nombre}
                </Heading>
                <p className="prosa mt-4 text-gris">{m.descripcion}</p>
                <ul className="mt-6 divide-y divide-linea border-y border-linea">
                  {m.productos.map((p) => (
                    <li key={p.slug} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
                      <span className="font-medium text-tinta">{p.nombre}</span>
                      <span className="text-sm text-gris">{p.para}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {m.imagen ? (
                <div className={`relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-t-full rounded-b-[2.5rem] shadow-soft ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Image src={m.imagen} alt={`Productos ${m.nombre}`} fill sizes="(min-width: 1024px) 26rem, 88vw" className="object-cover" />
                </div>
              ) : (
                <div className="glass hidden aspect-[4/5] max-w-[26rem] items-center justify-center rounded-t-full rounded-b-[2.5rem] lg:mx-auto lg:flex lg:w-full">
                  <span className="titular px-8 text-center text-display-md text-lila-400">{m.nombre}</span>
                </div>
              )}
            </section>
          ))}

          <section className="glass rounded-card p-8 sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <Heading tamano="md">¿Cuál es para tu piel?</Heading>
                <p className="mt-3 text-gris">Los productos se recomiendan en la valoración según tu tipo de piel y tu protocolo. Escríbenos o agenda tu cita.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AgendarButton ubicacion="productos" />
                <WhatsAppButton ubicacion="productos" variante="secundario" servicio="dermocosmética" />
              </div>
            </div>
          </section>
        </Container>
      </div>
    </main>
  );
}
