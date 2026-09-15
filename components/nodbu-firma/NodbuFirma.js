'use client';
/*!
 * NODBU · Firma de autor para React y Next.js · v1.0.0 · https://nodbu.com
 *
 *   import NodbuFirma from '@/components/nodbu-firma/NodbuFirma';
 *   <NodbuFirma />
 *
 * Se puede usar dentro de un Server Component (el pie no tiene que ser cliente).
 * El HTML del servidor ya trae el enlace a nodbu.com; en el navegador se carga
 * nodbu-firma.js y lo convierte en la firma animada.
 *
 * Escrito sin JSX a propósito: funciona igual en proyectos JavaScript y
 * TypeScript (los tipos están en NodbuFirma.d.ts), con React 18 y 19.
 */
import { createElement, useEffect, version } from 'react';

const si = (valor) => (valor ? '' : undefined);
// En etiquetas personalizadas React 18 no traduce className a class; React 19 sí.
const CLASE = parseInt(version, 10) >= 19 ? 'className' : 'class';

export default function NodbuFirma({ texto, lang, fondo, mono, quieto, nofollow, tamano, className, style }) {
  useEffect(() => {
    import('./nodbu-firma.js');
  }, []);

  const ingles = /^en\b/i.test(lang || '');
  const estilo = tamano
    ? { ...style, '--nodbu-firma-tamano': typeof tamano === 'number' ? `${tamano}px` : tamano }
    : style;

  return createElement(
    'nodbu-firma',
    { [CLASE]: className, texto, lang, fondo, style: estilo, mono: si(mono), quieto: si(quieto), nofollow: si(nofollow) },
    // Respaldo: lo que ven los buscadores y quien no tenga JavaScript.
    createElement(
      'a',
      {
        href: 'https://nodbu.com/',
        target: '_blank',
        rel: nofollow ? 'noopener nofollow' : 'noopener',
        style: { color: 'inherit', textDecoration: 'none' },
      },
      `${texto || (ingles ? 'Built by' : 'Desarrollado por')} NODBU`
    )
  );
}
