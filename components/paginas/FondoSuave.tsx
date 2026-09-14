/** Fondo decorativo ligero para subpáginas (sin 3D): aurora fija detrás del contenido. */
export function FondoSuave() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(55%_45%_at_85%_15%,rgb(235_221_243/0.7),transparent_70%),radial-gradient(40%_40%_at_8%_90%,rgb(212_228_229/0.6),transparent_70%)]" />
  );
}
