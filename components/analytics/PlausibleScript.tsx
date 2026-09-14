import Script from "next/script";

/**
 * Script de Plausible (autoalojado). Solo se incluye si existe
 * NEXT_PUBLIC_PLAUSIBLE_HOST en el momento del build.
 * Activarlo = llenar la variable en .env y volver a construir.
 */
export function PlausibleScript() {
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
  const dominio = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "anacure.co";
  if (!host) return null;
  const base = host.replace(/\/$/, "");
  return (
    <>
      <Script id="plausible-cola" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
      </Script>
      <Script defer data-domain={dominio} src={`${base}/js/script.js`} strategy="afterInteractive" />
    </>
  );
}
