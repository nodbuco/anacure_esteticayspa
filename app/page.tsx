import { CtaFinal } from "@/components/home/CtaFinal";
import { Experiencia } from "@/components/home/Experiencia";
import { Hero } from "@/components/home/Hero";
import { Historias } from "@/components/home/Historias";
import { Insignias } from "@/components/home/Insignias";
import { Marcas } from "@/components/home/Marcas";
import { Sedes } from "@/components/home/Sedes";
import { Servicios } from "@/components/home/Servicios";
import { FlowerField } from "@/components/three/FlowerField";

/**
 * Home con scroll narrativo. El fondo de flores es un canvas fijo (z-0) detrás de todas
 * las secciones; cada sección lleva data-scene para que el scroll gobierne la escena.
 * Las secciones sin fondo dejan ver las flores; las de fondo blanco o noche marcan el ritmo.
 */
export default function Home() {
  return (
    <main className="relative">
      <FlowerField />
      <Hero />
      <Insignias />
      <Experiencia />
      <Servicios />
      <Marcas />
      <Historias />
      <Sedes />
      <CtaFinal />
    </main>
  );
}
