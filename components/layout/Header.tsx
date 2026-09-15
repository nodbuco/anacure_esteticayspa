"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AgendarButton } from "@/components/cta/AgendarButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { IconoCerrar, IconoInstagram, IconoMenu } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { NAV_PRINCIPAL } from "@/data/navegacion";
import { LISTA_SEDES } from "@/data/sedes";
import type { CategoriaMenu } from "@/data/servicios";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";
import { MenuServicios } from "./MenuServicios";

export function Header({ servicios }: { servicios: CategoriaMenu[] }) {
  const pathname = usePathname();
  // Se guarda la ruta en la que se abrió: al navegar, deja de coincidir y el menú se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === pathname;
  const setAbierto = (v: boolean) => setAbiertoEn(v ? pathname : null);

  // Bloquea el scroll del fondo con el menú abierto
  useEffect(() => {
    document.documentElement.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header className="sticky top-0 z-50 border-b border-linea/70 bg-blanco/85 backdrop-blur-md">
      <a href="#contenido" className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-pill bg-purpura px-4 py-2 text-sm font-medium text-blanco">
        Ir al contenido
      </a>
      <Container className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Logo enlace className="h-11 lg:h-12" />

        <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV_PRINCIPAL.map((e) =>
            e.href === "/servicios" ? (
              <MenuServicios key={e.href} categorias={servicios} />
            ) : (
              <Link
                key={e.href}
                href={e.href}
                className="relative whitespace-nowrap text-[0.95rem] font-medium text-tinta-suave transition-colors duration-300 hover:text-purpura after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-purpura after:transition-[width] after:duration-300 after:ease-luxe hover:after:w-full"
              >
                {e.etiqueta}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppButton ubicacion="cabecera" soloIcono className="lg:hidden" />
          <div className="hidden sm:block">
            <AgendarButton ubicacion="cabecera">Agendar</AgendarButton>
          </div>
          <button
            type="button"
            onClick={() => setAbierto(!abierto)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex size-12 items-center justify-center rounded-pill text-tinta hover:bg-lila-100 lg:hidden"
          >
            {abierto ? <IconoCerrar className="size-6" /> : <IconoMenu className="size-6" />}
          </button>
        </div>
      </Container>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        hidden={!abierto}
        className={cn("fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-blanco lg:hidden")}
      >
        <Container className="flex min-h-full flex-col py-8">
          <nav aria-label="Principal (móvil)" className="flex flex-col">
            {NAV_PRINCIPAL.map((e) => (
              <div key={e.href} className="border-b border-linea">
                <Link href={e.href} onClick={() => setAbierto(false)} className="titular block py-4 text-display-sm text-tinta hover:text-purpura">
                  {e.etiqueta}
                </Link>
                {e.href === "/servicios" && (
                  <div className="-mt-1 flex flex-wrap gap-2 pb-4">
                    {servicios.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/servicios#${c.slug}`}
                        onClick={() => setAbierto(false)}
                        className="rounded-pill bg-lila-100 px-3 py-1.5 text-sm text-tinta transition-colors hover:bg-lila-200 hover:text-purpura"
                      >
                        {c.corto}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 grid gap-3">
            <AgendarButton ubicacion="menu-movil" tamano="lg" className="w-full" />
            {LISTA_SEDES.map((s) => (
              <WhatsAppButton key={s.slug} sede={s.slug} ubicacion="menu-movil" variante="secundario" className="w-full">
                WhatsApp {s.nombre}
              </WhatsAppButton>
            ))}
          </div>

          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 pt-10 text-sm text-gris hover:text-purpura"
          >
            <IconoInstagram className="size-5" />
            {SITE.instagramUsuario}
          </a>
        </Container>
      </div>
    </header>
  );
}
