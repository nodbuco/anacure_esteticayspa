"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { escena } from "@/lib/escenas";
import { ALTO_VISIBLE_0, CAMARA_Z, disposicion, PALETAS, type FlorBase } from "./petalo";
import { crearGeometriaPetalo } from "./petaloGeometria";

const PUNTOS = 8; // como los ocho puntos del isotipo

interface Flor extends FlorBase {
  x: number;
  y: number;
  interiores: number;
  base: THREE.Quaternion;
  giro: number;
  apertura0: number;
  deriva: number;
  vaiven: number;
  colorExterior: THREE.Color;
  colorInterior: THREE.Color;
  colorCentro: THREE.Color;
  colorPuntos: THREE.Color;
  primerPetalo: number;
}

function construir(ancho: number, alto: number, movil: boolean): Flor[] {
  let indice = 0;
  return disposicion(movil).map((f, i) => {
    const factor = (CAMARA_Z - f.z) / CAMARA_Z;
    const paleta = PALETAS[f.paleta];
    const interiores = f.petalos - 2;
    const flor: Flor = {
      ...f,
      x: f.nx * (ancho / 2) * factor,
      y: f.ny * (alto / 2) * factor,
      interiores,
      // Todas miran a la cámara con una inclinación leve y coherente (no caótica)
      base: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.18 * Math.sin(i * 1.9), 0.22 * Math.cos(i * 1.3), 0)),
      giro: 0.05 + 0.04 * ((i * 7) % 5) / 5,
      apertura0: 0.5 + 0.2 * Math.abs(Math.sin(i * 2.3)),
      deriva: 1.0 + 1.8 * (0.5 + 0.5 * Math.sin(i * 1.1)),
      vaiven: 0.04 + 0.05 * (0.5 + 0.5 * Math.cos(i * 0.9)),
      colorExterior: new THREE.Color(paleta.exterior),
      colorInterior: new THREE.Color(paleta.interior),
      colorCentro: new THREE.Color(paleta.centro),
      colorPuntos: new THREE.Color(paleta.puntos),
      primerPetalo: indice,
    };
    indice += f.petalos + interiores;
    return flor;
  });
}

const m4 = new THREE.Matrix4();
/** Instancia invisible (escala 0): estado de una malla antes de colocar sus flores. */
const OCULTA = new THREE.Matrix4().makeScale(0, 0, 0);
const q = new THREE.Quaternion();
const qz = new THREE.Quaternion();
const qx = new THREE.Quaternion();
const ejeZ = new THREE.Vector3(0, 0, 1);
const ejeX = new THREE.Vector3(1, 0, 0);
const pos = new THREE.Vector3();
const esc = new THREE.Vector3();
const mira = new THREE.Vector3();
const local = new THREE.Vector3();
const suavizar = (a: number, b: number, t: number) => a + (b - a) * t * t * (3 - 2 * t);

/** Resolución del canvas: normal (máximo 1,5) y con las flores desenfocadas detrás del texto. */
export const DPR_NORMAL: [number, number] = [1, 1.5];
const DPR_DESENFOCADO = 0.75;

export function Flores() {
  const { viewport, size, camera, invalidate } = useThree();
  const petalosRef = useRef<THREE.InstancedMesh>(null);
  const centrosRef = useRef<THREE.InstancedMesh>(null);
  const puntosRef = useRef<THREE.InstancedMesh>(null);
  const suave = useRef({ p: 0, px: 0, py: 0, t0: -1, escritas: false, eraSuave: false, desdeSuave: 0, dprBajo: false });

  const movil = size.width < 768;
  const flores = useMemo(() => construir(viewport.width, viewport.height, movil), [viewport.width, viewport.height, movil]);
  const totalPetalos = flores.reduce((s, f) => s + f.petalos + f.interiores, 0);

  const geoPetalo = useMemo(() => crearGeometriaPetalo(), []);
  const geoCentro = useMemo(() => new THREE.SphereGeometry(0.1, 16, 12), []);
  const geoPunto = useMemo(() => new THREE.SphereGeometry(0.05, 10, 8), []);
  const matPetalo = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0, side: THREE.DoubleSide, vertexColors: true }),
    [],
  );
  const matLiso = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0 }), []);

  useEffect(() => {
    escena.invalidar = invalidate;
    return () => {
      escena.invalidar = undefined;
    };
  }, [invalidate]);

  useEffect(
    () => () => {
      geoPetalo.dispose();
      geoCentro.dispose();
      geoPunto.dispose();
      matPetalo.dispose();
      matLiso.dispose();
    },
    [geoPetalo, geoCentro, geoPunto, matPetalo, matLiso],
  );

  // Colores por instancia: una sola vez.
  useEffect(() => {
    const p = petalosRef.current;
    const c = centrosRef.current;
    const d = puntosRef.current;
    if (!p || !c || !d) return;
    flores.forEach((f, i) => {
      for (let k = 0; k < f.petalos; k++) p.setColorAt(f.primerPetalo + k, f.colorExterior);
      for (let k = 0; k < f.interiores; k++) p.setColorAt(f.primerPetalo + f.petalos + k, f.colorInterior);
      c.setColorAt(i, f.colorCentro);
      for (let k = 0; k < PUNTOS; k++) d.setColorAt(i * PUNTOS + k, f.colorPuntos);
    });
    // Hasta que useFrame las coloque, las instancias no se ven. Una malla recién creada tiene
    // todas sus instancias en el origen: sin esto se vería un «pétalo» en el centro de la pantalla.
    for (const mesh of [p, c, d]) {
      for (let k = 0; k < mesh.count; k++) mesh.setMatrixAt(k, OCULTA);
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    suave.current.escritas = false;
    invalidate();
  }, [flores, invalidate]);

  useFrame((state, delta) => {
    const p = petalosRef.current;
    const c = centrosRef.current;
    const d = puntosRef.current;
    if (!p || !c || !d) return;

    const s = suave.current;
    // Con el pie a la vista no hace falta dibujar, pero solo después de haber colocado las
    // flores al menos una vez: si no, se quedarían ocultas o amontonadas en el centro.
    if (!escena.activo && s.escritas) {
      if (state.frameloop !== "demand") state.setFrameloop("demand");
      return;
    }
    if (escena.activo && state.frameloop !== "always") state.setFrameloop("always");

    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    // Desenfocadas no necesitan nitidez: pasado el fundido del desenfoque (0,9 s) se dibujan a
    // menos resolución, y recuperan la normal en cuanto vuelven a enfocarse. setDpr redimensiona
    // el canvas aquí, antes de dibujar este mismo fotograma, así que no hay parpadeo.
    if (escena.suave !== s.eraSuave) {
      s.eraSuave = escena.suave;
      s.desdeSuave = t;
    }
    const dprBajo = s.eraSuave && t - s.desdeSuave > 1;
    if (dprBajo !== s.dprBajo) {
      s.dprBajo = dprBajo;
      state.setDpr(dprBajo ? DPR_DESENFOCADO : DPR_NORMAL);
    }
    const objetivo = Number.isFinite(escena.global) ? THREE.MathUtils.clamp(escena.global, 0, 1) : s.p;
    if (s.t0 < 0) {
      // Primer fotograma: la cámara arranca donde está el scroll, sin barrido.
      s.t0 = t;
      s.p = objetivo;
    }
    // Florecer al aparecer: de capullo a su apertura normal en 1,6 s
    const nacer = suavizar(0, 1, THREE.MathUtils.clamp((t - s.t0) / 1.6, 0, 1));
    s.p = THREE.MathUtils.damp(s.p, objetivo, 3.2, dt);
    s.px = THREE.MathUtils.damp(s.px, escena.puntero.x, 2.5, dt);
    s.py = THREE.MathUtils.damp(s.py, escena.puntero.y, 2.5, dt);
    const prog = s.p;

    const camY = -prog * 5.5;
    camera.position.set(s.px * 0.6, camY + s.py * 0.4, CAMARA_Z);
    mira.set(s.px * 0.15, camY - 0.3, 0);
    camera.lookAt(mira);
    // Pulso (al tocar un paso de la experiencia): las flores se abren un instante
    const pulso = escena.pulso ? Math.max(0, 1 - (performance.now() - escena.pulso) / 1400) : 0;
    const extraApertura = 0.3 * Math.sin(pulso * Math.PI);

    for (let i = 0; i < flores.length; i++) {
      const f = flores[i];
      const giro = f.fase + t * f.giro + prog * Math.PI * 0.6;
      const apertura = THREE.MathUtils.clamp((f.apertura0 + 0.25 * Math.sin(prog * Math.PI * 2 + f.fase) + 0.08 * Math.sin(t * 0.4 + f.fase) + extraApertura) * nacer, 0, 1);
      const cierreExt = THREE.MathUtils.lerp(1.4, 0.2, apertura);
      const cierreInt = THREE.MathUtils.lerp(1.5, 0.55, apertura);
      const x = f.x + Math.sin(t * 0.3 + f.fase) * f.vaiven;
      // Jardín continuo: la flor sube con el scroll y, al salir por arriba, vuelve a entrar por abajo.
      const altoVisible = ALTO_VISIBLE_0 * ((CAMARA_Z - f.z) / CAMARA_Z);
      const rango = altoVisible * 1.7;
      let rel = f.y + Math.cos(t * 0.25 + f.fase * 1.3) * f.vaiven + prog * f.deriva - camY;
      rel = ((((rel + rango / 2) % rango) + rango) % rango) - rango / 2;
      const y = camY + rel;
      pos.set(x, y, f.z);

      // Corona exterior
      esc.setScalar(f.escala);
      for (let k = 0; k < f.petalos; k++) {
        const cierre = cierreExt * (0.92 + 0.16 * (0.5 + 0.5 * Math.sin(f.fase * 3 + k * 1.7)));
        qz.setFromAxisAngle(ejeZ, giro + (k * Math.PI * 2) / f.petalos);
        qx.setFromAxisAngle(ejeX, -cierre);
        q.copy(f.base).multiply(qz).multiply(qx);
        m4.compose(pos, q, esc);
        p.setMatrixAt(f.primerPetalo + k, m4);
      }
      // Corona interior: más pequeña, girada medio paso, un poco más cerrada
      esc.setScalar(f.escala * 0.56);
      for (let k = 0; k < f.interiores; k++) {
        qz.setFromAxisAngle(ejeZ, giro + Math.PI / f.interiores + (k * Math.PI * 2) / f.interiores);
        qx.setFromAxisAngle(ejeX, -cierreInt);
        q.copy(f.base).multiply(qz).multiply(qx);
        local.set(0, 0, 0.03 * f.escala).applyQuaternion(f.base).add(pos);
        m4.compose(local, q, esc);
        p.setMatrixAt(f.primerPetalo + f.petalos + k, m4);
      }
      // Centro
      local.set(0, 0, 0.08 * f.escala).applyQuaternion(f.base).add(pos);
      esc.setScalar(f.escala * 1.05);
      m4.compose(local, f.base, esc);
      c.setMatrixAt(i, m4);
      // Ocho puntos alrededor, en el plano de la flor, entre los pétalos
      const radio = f.escala * 1.14;
      esc.setScalar(f.escala * 1.0);
      for (let k = 0; k < PUNTOS; k++) {
        const a = giro + Math.PI / PUNTOS + (k * Math.PI * 2) / PUNTOS;
        local.set(Math.cos(a) * radio, Math.sin(a) * radio, 0).applyQuaternion(f.base).add(pos);
        m4.compose(local, f.base, esc);
        d.setMatrixAt(i * PUNTOS + k, m4);
      }
    }
    p.instanceMatrix.needsUpdate = true;
    c.instanceMatrix.needsUpdate = true;
    d.instanceMatrix.needsUpdate = true;
    s.escritas = true;
  });

  return (
    <>
      <instancedMesh key={`p${totalPetalos}`} ref={petalosRef} args={[geoPetalo, matPetalo, totalPetalos]} frustumCulled={false} />
      <instancedMesh key={`c${flores.length}`} ref={centrosRef} args={[geoCentro, matLiso, flores.length]} frustumCulled={false} />
      <instancedMesh key={`d${flores.length}`} ref={puntosRef} args={[geoPunto, matLiso, flores.length * PUNTOS]} frustumCulled={false} />
    </>
  );
}
