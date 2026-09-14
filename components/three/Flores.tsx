"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { escena } from "@/lib/escenas";
import { crearAleatorio, elegirPaleta } from "./petalo";
import { crearGeometriaPetalo } from "./petaloGeometria";

const CAMARA_Z = 10;

interface Flor {
  x: number;
  y: number;
  z: number;
  escala: number;
  petalos: number;
  fase: number;
  giro: number;
  base: THREE.Quaternion;
  apertura0: number;
  deriva: number;
  vaiven: number;
  colorPetalo: THREE.Color;
  colorCentro: THREE.Color;
  primerIndice: number;
}

/**
 * Distribuye las flores en coordenadas normalizadas del viewport (-1..1) y las
 * convierte a unidades de mundo según su profundidad. En escritorio se agrupan a la
 * derecha (el texto vive a la izquierda); en móvil, en la franja superior y el borde
 * derecho, lejos del titular.
 */
function generarFlores(ancho: number, alto: number, movil: boolean): Flor[] {
  const rnd = crearAleatorio(20260914);
  const n = movil ? 11 : 17;
  const flores: Flor[] = [];
  let indice = 0;
  for (let i = 0; i < n; i++) {
    const z = -rnd() * 7;
    const factor = (CAMARA_Z - z) / CAMARA_Z;
    const hw = (ancho / 2) * factor;
    const hh = (alto / 2) * factor;
    const r = rnd();
    let nx: number;
    let ny: number;
    if (movil) {
      if (r < 0.55) {
        // franja superior, sobre todo a la derecha del titular
        nx = -0.5 + rnd() * 1.6;
        ny = 0.62 + rnd() * 0.45;
      } else {
        // borde derecho, fuera de la columna de texto
        nx = 0.78 + rnd() * 0.4;
        ny = -0.9 + rnd() * 1.4;
      }
    } else if (r < 0.7) {
      nx = 0.22 + rnd() * 0.88;
      ny = -0.95 + rnd() * 1.9;
    } else if (r < 0.9) {
      nx = -1.12 + rnd() * 0.5;
      ny = -1.05 + rnd() * 0.7;
    } else {
      nx = -0.25 + rnd() * 0.4;
      ny = 0.7 + rnd() * 0.45;
    }
    const paleta = elegirPaleta(rnd);
    const petalos = 6 + Math.floor(rnd() * 3);
    const base = new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd() - 0.5) * 1.1, (rnd() - 0.5) * 1.1, 0));
    // Flores pequeñas y delicadas: entre el 5 % y el 16 % de la altura visible.
    // Las lejanas se compensan con la profundidad para no desaparecer.
    const escalaBase = (movil ? 0.09 : 0.2) + rnd() * (movil ? 0.13 : 0.36);
    flores.push({
      x: nx * hw,
      y: ny * hh,
      z,
      escala: escalaBase * (1 + 0.45 * (-z / 7)),
      petalos,
      fase: rnd() * Math.PI * 2,
      giro: (rnd() - 0.5) * 0.14,
      base,
      apertura0: 0.45 + rnd() * 0.3,
      deriva: 1.2 + rnd() * 2.6,
      vaiven: 0.06 + rnd() * 0.1,
      colorPetalo: new THREE.Color(paleta.petalo),
      colorCentro: new THREE.Color(paleta.centro),
      primerIndice: indice,
    });
    indice += petalos;
  }
  return flores;
}

const m4 = new THREE.Matrix4();
const q = new THREE.Quaternion();
const qz = new THREE.Quaternion();
const qx = new THREE.Quaternion();
const ejeZ = new THREE.Vector3(0, 0, 1);
const ejeX = new THREE.Vector3(1, 0, 0);
const pos = new THREE.Vector3();
const esc = new THREE.Vector3();
const mira = new THREE.Vector3();

export function Flores() {
  const { viewport, size, camera, invalidate } = useThree();
  const petalosRef = useRef<THREE.InstancedMesh>(null);
  const centrosRef = useRef<THREE.InstancedMesh>(null);
  const suave = useRef({ p: 0, px: 0, py: 0 });

  const movil = size.width < 768;
  // Solo se recalcula si cambia el ancho (evita saltos con la barra del navegador móvil).
  const flores = useMemo(() => generarFlores(viewport.width, viewport.height, movil), [viewport.width, viewport.height, movil]);
  const totalPetalos = flores.reduce((s, f) => s + f.petalos, 0);

  const geoPetalo = useMemo(() => crearGeometriaPetalo(), []);
  const geoCentro = useMemo(() => new THREE.SphereGeometry(0.1, 14, 12), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0, side: THREE.DoubleSide, vertexColors: true }),
    [],
  );
  const materialCentro = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0 }), []);

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
      material.dispose();
      materialCentro.dispose();
    },
    [geoPetalo, geoCentro, material, materialCentro],
  );

  // Colores por instancia: se escriben una vez.
  useEffect(() => {
    const p = petalosRef.current;
    const c = centrosRef.current;
    if (!p || !c) return;
    flores.forEach((f, i) => {
      for (let k = 0; k < f.petalos; k++) p.setColorAt(f.primerIndice + k, f.colorPetalo);
      c.setColorAt(i, f.colorCentro);
    });
    if (p.instanceColor) p.instanceColor.needsUpdate = true;
    if (c.instanceColor) c.instanceColor.needsUpdate = true;
    invalidate();
  }, [flores, invalidate]);

  useFrame((state, delta) => {
    const p = petalosRef.current;
    const c = centrosRef.current;
    if (!p || !c) return;

    // Ahorro: con el pie visible no hay nada que mostrar → modo bajo demanda.
    if (!escena.activo) {
      if (state.frameloop !== "demand") state.setFrameloop("demand");
      return;
    }
    if (state.frameloop !== "always") state.setFrameloop("always");

    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const s = suave.current;
    s.p = THREE.MathUtils.damp(s.p, escena.global, 3.2, dt);
    s.px = THREE.MathUtils.damp(s.px, escena.puntero.x, 2.5, dt);
    s.py = THREE.MathUtils.damp(s.py, escena.puntero.y, 2.5, dt);
    const prog = s.p;

    // Cámara: baja despacio con el scroll (paralaje) y responde sutilmente al puntero.
    camera.position.set(s.px * 0.7, -prog * 5.5 + s.py * 0.45, CAMARA_Z);
    mira.set(s.px * 0.2, -prog * 5.5 - 0.4, 0);
    camera.lookAt(mira);

    for (let i = 0; i < flores.length; i++) {
      const f = flores[i];
      const giro = f.fase + t * f.giro + prog * Math.PI * 0.75;
      // Apertura: capullo suave en el hero, se abre al avanzar, con una respiración lenta.
      const apertura = THREE.MathUtils.clamp(f.apertura0 + prog * 0.7 + 0.1 * Math.sin(t * 0.45 + f.fase), 0, 1);
      const cierreBase = THREE.MathUtils.lerp(1.35, 0.18, apertura);
      const x = f.x + Math.sin(t * 0.32 + f.fase) * f.vaiven;
      const y = f.y + Math.cos(t * 0.27 + f.fase * 1.3) * f.vaiven + prog * f.deriva;
      pos.set(x, y, f.z);
      esc.setScalar(f.escala);

      for (let k = 0; k < f.petalos; k++) {
        // Cada pétalo se cierra un poco distinto: rompe la simetría perfecta.
        const cierre = cierreBase * (0.85 + 0.3 * (0.5 + 0.5 * Math.sin(f.fase * 3 + k * 1.7)));
        qz.setFromAxisAngle(ejeZ, giro + (k * Math.PI * 2) / f.petalos);
        qx.setFromAxisAngle(ejeX, -cierre);
        q.copy(f.base).multiply(qz).multiply(qx);
        m4.compose(pos, q, esc);
        p.setMatrixAt(f.primerIndice + k, m4);
      }
      pos.z += 0.06 * f.escala;
      esc.setScalar(f.escala * 0.9);
      m4.compose(pos, f.base, esc);
      c.setMatrixAt(i, m4);
    }
    p.instanceMatrix.needsUpdate = true;
    c.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh key={`p${totalPetalos}`} ref={petalosRef} args={[geoPetalo, material, totalPetalos]} frustumCulled={false} />
      <instancedMesh key={`c${flores.length}`} ref={centrosRef} args={[geoCentro, materialCentro, flores.length]} frustumCulled={false} />
    </>
  );
}
