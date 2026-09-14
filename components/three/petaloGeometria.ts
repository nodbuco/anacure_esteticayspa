import * as THREE from "three";

/**
 * Pétalo procedural con la silueta de hoja del isotipo (almendra con las dos
 * puntas afiladas). Base en el origen, se extiende hacia +Y con largo 1.
 * Ligera curvatura en Z para que la luz lo modele: punta que se levanta y
 * bordes que se recogen (forma de cuenco).
 */
export function crearGeometriaPetalo(segU = 18, segV = 6): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];

  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    const semiAncho = 0.34 * Math.pow(Math.sin(Math.PI * u), 0.9);
    for (let j = 0; j <= segV; j++) {
      const v = -1 + (2 * j) / segV;
      const x = v * semiAncho;
      const y = u;
      const z = 0.34 * u * u - 0.14 * v * v * Math.sin(Math.PI * u);
      pos.push(x, y, z);
      uv.push(v * 0.5 + 0.5, u);
      // Sombreado propio: base más oscura, punta más clara (se multiplica por el color de instancia).
      const brillo = 0.66 + 0.34 * Math.pow(u, 0.8) - 0.08 * Math.abs(v);
      col.push(brillo, brillo, brillo);
    }
  }
  const filas = segV + 1;
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * filas + j;
      const b = a + filas;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

