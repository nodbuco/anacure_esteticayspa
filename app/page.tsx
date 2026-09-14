import { Hero } from "@/components/home/Hero";
import { Sedes } from "@/components/home/Sedes";
import { FlowerField } from "@/components/three/FlowerField";

/**
 * Home con scroll narrativo. El fondo de flores es un canvas fijo (z-0) que vive
 * detrás de todas las secciones; cada sección lleva data-scene para que el scroll
 * gobierne la escena. Las secciones sin fondo dejan ver las flores; las tarjetas
 * de vidrio las difuminan.
 */
export default function Home() {
  return (
    <main className="relative">
      <FlowerField />
      <Hero />
      <Sedes />
    </main>
  );
}
