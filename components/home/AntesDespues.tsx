"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  antes: string;
  despues: string;
  alt: string;
  className?: string;
}

/**
 * Comparador antes/después: arrastra (o usa las flechas del teclado) para revelar.
 * El control real es un <input type="range"> invisible sobre toda la imagen.
 */
export function AntesDespues({ antes, despues, alt, className }: Props) {
  const [pos, setPos] = useState(50);
  return (
    <div
      className={`relative aspect-[3/4] select-none overflow-hidden rounded-[2rem] bg-lila-100 shadow-soft ${className ?? ""}`}
      style={{ "--pos": `${pos}%` } as React.CSSProperties}
    >
      <Image src={despues} alt={`${alt}, después`} fill sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        <Image src={antes} alt={`${alt}, antes`} fill sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
      </div>

      <span className="glass-chip absolute left-4 top-4 text-xs font-medium text-tinta">Antes</span>
      <span className="glass-chip absolute right-4 top-4 text-xs font-medium text-tinta">Después</span>

      <div aria-hidden="true" className="absolute inset-y-0 w-px -translate-x-1/2 bg-blanco/90 shadow-[0_0_0_1px_rgb(10_10_48/0.08)]" style={{ left: "var(--pos)" }}>
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blanco text-purpura shadow-float">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar antes y después"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
