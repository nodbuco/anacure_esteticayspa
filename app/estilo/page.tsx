import type { Metadata } from "next";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconoFlecha } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

const marca = [
  { nombre: "Púrpura Ana Cure", hex: "#8323AB", clase: "bg-purpura", uso: "Principal · botones · titulares destacados" },
  { nombre: "Verde azulado", hex: "#147B80", clase: "bg-verde", uso: "WhatsApp · antetítulos · acentos" },
  { nombre: "Índigo", hex: "#252474", clase: "bg-indigo", uso: "Solape de hojas · base de neutros" },
  { nombre: "Ciruela", hex: "#561D87", clase: "bg-ciruela", uso: "Puntos · hover del púrpura" },
];

const derivados = [
  { nombre: "lila-50", hex: "#FAF7FC", clase: "bg-lila-50", formula: "4 % púrpura + blanco · fondo de página" },
  { nombre: "lila-100", hex: "#F5EEF9", clase: "bg-lila-100", formula: "8 % · fondos suaves" },
  { nombre: "lila-200", hex: "#EBDDF3", clase: "bg-lila-200", formula: "16 % · veladuras" },
  { nombre: "lila-300", hex: "#DAC0E8", clase: "bg-lila-300", formula: "30 % · bordes de énfasis" },
  { nombre: "menta-100", hex: "#E9F1F2", clase: "bg-menta-100", formula: "10 % verde + blanco" },
  { nombre: "menta-200", hex: "#D4E4E5", clase: "bg-menta-200", formula: "20 % verde + blanco" },
  { nombre: "verde-oscuro", hex: "#0B565A", clase: "bg-verde-oscuro", formula: "verde + 22 % negro · hover" },
  { nombre: "tinta", hex: "#0A0A30", clase: "bg-tinta", formula: "índigo + 45 % negro · texto" },
  { nombre: "gris", hex: "#606791", clase: "bg-gris", formula: "índigo-negro + blanco · texto secundario (5,5:1)" },
  { nombre: "linea", hex: "#E1E3EF", clase: "bg-linea", formula: "12 % índigo + blanco · bordes" },
  { nombre: "noche", hex: "#0A0A30", clase: "bg-noche", formula: "fondo oscuro del pie" },
];

export default function EstiloPage() {
  return (
    <main>
      <Section tono="claro">
        <Container>
          <Eyebrow>Sistema de diseño · fase a</Eyebrow>
          <Heading nivel={1} tamano="lg" className="mt-4">
            Tokens, tipografía y componentes
          </Heading>
          <p className="prosa mt-4 text-gris">
            Página interna para revisar el sistema. No se indexa. Todo lo que ves aquí sale de los archivos del kit de identidad.
          </p>
        </Container>
      </Section>

      <Section tono="blanco">
        <Container>
          <Eyebrow>Color</Eyebrow>
          <Heading tamano="md" className="mt-3">
            Paleta del kit
          </Heading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marca.map((c) => (
              <div key={c.hex} className="overflow-hidden rounded-card border border-linea">
                <div className={`${c.clase} h-28`} />
                <div className="p-4">
                  <p className="font-medium">{c.nombre}</p>
                  <p className="font-mono text-sm text-gris">{c.hex}</p>
                  <p className="mt-1 text-xs text-gris">{c.uso}</p>
                </div>
              </div>
            ))}
          </div>
          <Heading tamano="sm" className="mt-14">
            Derivados (mezcla OKLab, sin colores nuevos)
          </Heading>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {derivados.map((c) => (
              <div key={c.nombre} className="flex items-center gap-3 rounded-2xl border border-linea p-3">
                <div className={`${c.clase} size-12 shrink-0 rounded-xl border border-linea`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {c.nombre} <span className="font-mono text-gris">{c.hex}</span>
                  </p>
                  <p className="text-xs text-gris">{c.formula}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tono="claro">
        <Container>
          <Eyebrow>Tipografía</Eyebrow>
          <Heading tamano="md" className="mt-3">
            Cinzel para titulares, Inter para todo lo demás
          </Heading>
          <div className="mt-10 space-y-10">
            <div>
              <p className="text-xs text-gris">display-xl · h1 del hero</p>
              <p className="titular mt-2 text-display-xl">Donde el cuidado se convierte en experiencia</p>
            </div>
            <div>
              <p className="text-xs text-gris">display-lg · títulos de sección</p>
              <p className="titular mt-2 text-display-lg">Cada piel tiene su propio protocolo</p>
            </div>
            <div>
              <p className="text-xs text-gris">display-md · subtítulos y tarjetas</p>
              <p className="titular mt-2 text-display-md">Ultraformer III y VOLNEWMER</p>
            </div>
            <div>
              <p className="text-xs text-gris">display-sm · etiquetas grandes</p>
              <p className="titular mt-2 text-display-sm">Cámara hiperbárica</p>
            </div>
            <div>
              <p className="text-xs text-gris">eyebrow · antetítulo</p>
              <Eyebrow className="mt-2">Facial y salud de la piel</Eyebrow>
            </div>
            <div>
              <p className="text-xs text-gris">lead · entradilla</p>
              <p className="prosa mt-2 text-lead text-gris">
                Medicina estética, tecnología de última generación y un spa para volver a ti. Tu primera cita es una valoración sin costo.
              </p>
            </div>
            <div>
              <p className="text-xs text-gris">cuerpo · Inter 400, 65 caracteres por línea</p>
              <p className="prosa mt-2">
                El Hydrafacial limpia, extrae e hidrata en una sola sesión. Es el tratamiento con el que más pieles han empezado su
                protocolo en Ana Cure desde 2017, y sigue siendo la puerta de entrada más cómoda para quien nunca se ha hecho un facial
                profesional.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tono="blanco">
        <Container>
          <Eyebrow>Componentes</Eyebrow>
          <Heading tamano="md" className="mt-3">
            Botones
          </Heading>
          <p className="mt-3 text-sm text-gris">Altura mínima 48 px: cómodos para cualquier dedo y cualquier edad.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button>Primario</Button>
            <Button variante="whatsapp">WhatsApp</Button>
            <Button variante="secundario">Secundario</Button>
            <Button variante="fantasma">
              Fantasma <IconoFlecha className="size-4" />
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button tamano="lg">Grande</Button>
            <Button tamano="lg" variante="whatsapp">
              Grande WhatsApp
            </Button>
          </div>
          <div className="mt-6 rounded-card bg-purpura p-8">
            <Button variante="inverso">Inverso sobre púrpura</Button>
          </div>

          <Heading tamano="md" className="mt-14">
            Llamados a la acción con selector de sede
          </Heading>
          <p className="mt-3 text-sm text-gris">
            Si el visitante no ha elegido sede, cualquiera de estos botones abre primero el diálogo de sede y recuerda la elección.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AgendarButton ubicacion="estilo" tamano="lg" />
            <WhatsAppButton ubicacion="estilo" tamano="lg" />
            <WhatsAppButton ubicacion="estilo" soloIcono />
          </div>
        </Container>
      </Section>

      <Section tono="claro">
        <Container>
          <Eyebrow>Marca</Eyebrow>
          <Heading tamano="md" className="mt-3">
            Logos del kit, sin modificar
          </Heading>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-card border border-linea bg-blanco p-10">
              <Logo version="horizontal" className="h-16" />
            </div>
            <div className="flex items-center justify-center rounded-card bg-purpura p-10">
              <Logo version="horizontal" color="blanco" className="h-16" />
            </div>
            <div className="flex items-center justify-center rounded-card border border-linea bg-blanco p-10">
              <Logo version="vertical" className="h-48" />
            </div>
            <div className="flex items-center justify-center gap-8 rounded-card bg-noche p-10">
              <Logo version="isotipo" color="blanco" className="h-20" />
              <Logo version="logotipo" color="blanco" className="h-14" />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
