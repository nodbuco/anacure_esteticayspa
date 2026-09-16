"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import heroFoto from "@/public/media/hero/ana-cure.jpg";

const variables = (v: Record<string, string>) => v as React.CSSProperties;

/*
 * Revelado antes de hidratar: en la primera visita el JavaScript de la página puede tardar
 * más que la foto. Este script en línea (texto fijo, sin datos externos) aplica la misma
 * regla que el componente —foto decodificada y arco en pantalla— en cuanto se lee el HTML.
 * En la navegación dentro del sitio no se ejecuta y lo resuelve el estado de React.
 */
const REVELAR_SIN_ESPERAR = `(function(){var f=document.getElementById("retrato-hero"),i=f&&f.querySelector("img");if(!i)return;var c=0,v=0;function r(){if(c&&v)f.setAttribute("data-revelado","")}function ok(){(i.decode?i.decode():Promise.resolve()).catch(function(){}).then(function(){c=1;r()})}function mal(){c=1;r()}if(i.complete){i.naturalWidth?ok():mal()}else{i.addEventListener("load",ok,{once:true});i.addEventListener("error",mal,{once:true})}if("IntersectionObserver"in window){var o=new IntersectionObserver(function(e){if(e[0].isIntersecting){v=1;o.disconnect();r()}},{threshold:0.2});o.observe(f)}else{v=1;r()}})();`;

/**
 * Retrato del hero. El arco tiene su forma final desde el primer pintado y lo llena
 * la versión borrosa de la foto. Cuando la imagen ya está descargada y decodificada
 * (next/image llama a onLoad después de decode()) y el arco está en pantalla, el velo
 * se disuelve mientras la foto se asienta y la línea del arco se dibuja de abajo arriba:
 * nunca se ve la imagen a medio pintar ni recortada (ver REVELAR_SIN_ESPERAR). La <img> no usa opacidad, así que
 * cuenta para el LCP en cuanto se pinta. Estilos en globals.css (.retrato-*).
 */
export function RetratoHero() {
  const figura = useRef<HTMLElement>(null);
  const [cargada, setCargada] = useState(false);
  const [enVista, setEnVista] = useState(false);

  useEffect(() => {
    const el = figura.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setEnVista(true);
        observador.disconnect();
      },
      { threshold: 0.2 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <>
      <figure
        ref={figura}
        id="retrato-hero"
      // El botón flotante de WhatsApp se aparta mientras pasa por encima del retrato y, con el hero en
      // una columna, espera a que termine de pasar (arriba ya está el botón de WhatsApp del hero).
      data-evita-flotante="hasta-pasar"
        data-revelado={(cargada && enVista) || undefined}
        // El script de abajo puede marcar data-revelado antes de que React hidrate.
        suppressHydrationWarning
        className="retrato relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem] lg:max-w-[min(28rem,calc((100svh-var(--alto-promo,0rem)-12.75rem)*0.75))] lg:justify-self-end"
      >
        {/* Halo suave detrás del arco: une el retrato con el fondo */}
        <div
          aria-hidden="true"
          className="entrada-aparecer absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(235_221_243/0.9),rgb(235_221_243/0.35)_55%,transparent_75%)]"
          style={variables({ "--retraso": "0.3s" })}
        />
        {/* Arco exterior fino, ligeramente desplazado */}
        <div
          aria-hidden="true"
          className="retrato-linea absolute -inset-3 rounded-t-full rounded-b-[3rem] border border-lila-300/80"
        />
        <div className="arco-foto relative aspect-[3/4]">
          <div className="retrato-imagen absolute inset-0">
            <Image
              src={heroFoto}
              alt="La doctora Ana Cure, gerente y cosmetóloga de Ana Cure Estética & Spa"
              fill
              priority
              quality={78}
              sizes="(min-width: 1024px) 28rem, (min-width: 640px) 26rem, 88vw"
              className="object-cover object-[50%_20%]"
              onLoad={() => setCargada(true)}
              onError={() => setCargada(true)}
            />
            <div
              aria-hidden="true"
              className="retrato-velo absolute inset-0"
              style={variables({ "--velo": `url(${heroFoto.blurDataURL})` })}
            />
          </div>
        </div>
        <figcaption className="retrato-pie mt-5 flex flex-col gap-1 px-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="titular whitespace-nowrap text-[0.72rem] tracking-[0.22em] text-purpura">
            Dra. Ana Cure
          </span>
          <span className="text-sm text-gris sm:text-right">
            Cosmetóloga · maestría internacional · fundadora
          </span>
        </figcaption>
      </figure>
      <script dangerouslySetInnerHTML={{ __html: REVELAR_SIN_ESPERAR }} />
    </>
  );
}
