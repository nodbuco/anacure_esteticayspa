import type { Metadata } from "next";
import { Agendador, type ServicioAgendable } from "@/components/agenda/Agendador";
import { Encabezado } from "@/components/paginas/Encabezado";
import { FondoSuave } from "@/components/paginas/FondoSuave";
import { Container } from "@/components/ui/Container";
import { esSede } from "@/data/sedes";
import { CATEGORIAS, SERVICIOS, servicioPorSlug } from "@/data/servicios";
import { hoyEnColombia } from "@/lib/agenda";

export const metadata: Metadata = {
  title: "Agenda tu cita",
  description: "Reserva en línea en Ana Cure Estética & Spa, en El Banco o en Aguachica. Tu primera cita es una valoración sin costo, presencial o virtual.",
  alternates: { canonical: "/agendar" },
  robots: { index: true, follow: true },
};

/** Lista mínima que viaja al navegador: solo lo que el agendador necesita. */
const AGENDABLES: ServicioAgendable[] = SERVICIOS.filter((s) => !s.soloWhatsApp).map(({ slug, nombre, duracionMin, categoria, sedes, resumen }) => ({
  slug,
  nombre,
  duracionMin,
  categoria,
  sedes,
  resumen,
}));

const CATEGORIAS_CORTAS = CATEGORIAS.map(({ slug, corto }) => ({ slug, corto }));

export default async function AgendarPage(props: PageProps<"/agendar">) {
  const { sede, servicio } = await props.searchParams;
  const sedeInicial = esSede(sede) ? sede : null;
  const servicioInicial = typeof servicio === "string" && servicioPorSlug(servicio) ? servicio : null;

  return (
    <main className="relative">
      <FondoSuave />
      <Encabezado
        eyebrow="Agenda en línea"
        titulo="Agenda tu cita"
        texto="Elige sede, tratamiento y hora; en un minuto queda reservada. Si es tu primera vez, empieza por la valoración: es sin costo, presencial o virtual."
        migas={[{ etiqueta: "Agenda", href: "/agendar" }]}
        ancho="amplio"
      />
      <section className="relative z-10 pb-section">
        <Container>
          <Agendador sedeInicial={sedeInicial} servicioInicial={servicioInicial} servicios={AGENDABLES} categorias={CATEGORIAS_CORTAS} hoy={hoyEnColombia()} />
        </Container>
      </section>
    </main>
  );
}
