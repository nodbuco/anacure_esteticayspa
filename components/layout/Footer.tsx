import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconoInstagram, IconoUbicacion, IconoWhatsApp } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { NAV_LEGAL, NAV_PRINCIPAL } from "@/data/navegacion";
import { HORARIO, LISTA_SEDES } from "@/data/sedes";
import { SITE } from "@/data/site";

export function Footer() {
  const anio = new Date().getFullYear();
  return (
    <footer className="bg-noche text-blanco">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_0.9fr]">
          <div>
            <Logo version="vertical" color="blanco" className="h-40" />
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-lila-300">{SITE.frases.consentirte}</p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-blanco/80 transition-colors hover:text-blanco"
            >
              <IconoInstagram className="size-5" />
              {SITE.instagramUsuario}
            </a>
          </div>

          {LISTA_SEDES.map((s) => (
            <div key={s.slug}>
              <Eyebrow tono="claro">{s.departamento}</Eyebrow>
              <h3 className="titular mt-2 text-display-sm">{s.nombre}</h3>
              <address className="mt-3 space-y-2 text-sm not-italic leading-relaxed text-blanco/75">
                <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 transition-colors hover:text-blanco">
                  <IconoUbicacion className="mt-0.5 size-4 shrink-0" />
                  <span>
                    {s.direccion}
                    {s.barrio ? `, ${s.barrio}` : ""}
                    <br />
                    {s.ciudad}, {s.departamento}
                  </span>
                </a>
                <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-blanco">
                  <IconoWhatsApp className="size-4 shrink-0" />
                  <span>{s.whatsappBonito}</span>
                </a>
              </address>
            </div>
          ))}

          <div>
            <Eyebrow tono="claro">Horario</Eyebrow>
            <dl className="mt-3 space-y-2 text-sm text-blanco/75">
              <div>
                <dt className="text-blanco/50">Lunes a viernes</dt>
                <dd>{HORARIO.lunesViernes}</dd>
              </div>
              <div>
                <dt className="text-blanco/50">Sábados</dt>
                <dd>{HORARIO.sabados}</dd>
              </div>
              <div>
                <dt className="text-blanco/50">Domingos y festivos</dt>
                <dd>{HORARIO.domingosFestivos}</dd>
              </div>
            </dl>
            <nav aria-label="Pie" className="mt-8 flex flex-col gap-2 text-sm">
              {NAV_PRINCIPAL.map((e) => (
                <Link key={e.href} href={e.href} className="text-blanco/75 transition-colors hover:text-blanco">
                  {e.etiqueta}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-blanco/10 pt-8 text-xs text-blanco/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {SITE.legal.razonSocial} · NIT {SITE.legal.nit}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV_LEGAL.map((e) => (
              <Link key={e.href} href={e.href} className="transition-colors hover:text-blanco">
                {e.etiqueta}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
