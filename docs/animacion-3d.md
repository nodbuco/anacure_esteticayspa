# Cómo funciona la animación 3D con scroll

Documento para quien mantenga el sitio. Explica qué hace cada archivo y por qué el 3D nunca frena la página.

## Las piezas

| Archivo | Qué hace |
|---|---|
| `lib/escenas.ts` | Un objeto compartido (`escena`) con el progreso del scroll, la sección activa, el puntero, un «pulso» y si el canvas debe seguir dibujando. |
| `components/motion/ScrollScenes.tsx` | Crea los ScrollTrigger de GSAP y **escribe** en `escena`. No toca React. |
| `components/three/FlowerField.tsx` | Decide si hay 3D (o solo 2D) y cuándo montarlo. Pinta siempre el fondo 2D. |
| `components/three/petalo.ts` | Sin three.js: silueta del pétalo, paleta del kit, generador determinista y **`disposicion(movil)`**, la guirnalda de flores que comparten el 2D y el 3D. |
| `components/three/FlowerFallback.tsx` | Las flores en SVG, colocadas con `disposicion`. Existen en el HTML desde el primer byte; derivan con CSS `animation-timeline: scroll()` y «florecen» con `@keyframes`. |
| `components/three/petaloGeometria.ts` | La geometría procedural del pétalo (sí importa three.js; solo va en el chunk diferido). |
| `components/three/FlowerCanvas.tsx` | El `<Canvas>` de React Three Fiber: luces, niebla, `dpr` y seguimiento del puntero. Monta `ScrollScenes`. |
| `components/three/Flores.tsx` | Dibuja la guirnalda con tres `InstancedMesh` y la anima en `useFrame` leyendo `escena`. |
| `components/home/Hero.tsx` | Hero. Su animación de entrada es CSS puro (clases `.entrada-*` en `globals.css`), sin JavaScript. |

## El flujo, paso a paso

1. **El HTML llega completo.** El hero (titular, texto, botones, foto) y el fondo 2D en SVG se renderizan en el servidor. El titular es el elemento LCP y no depende de ningún script.
2. **La misma guirnalda en 2D y 3D.** `disposicion(movil)` devuelve, para cada flor, su posición normalizada (`nx`, `ny`), profundidad, escala, número de pétalos, paleta y fase. En escritorio son 10 flores a lo largo de un arco más un trío en la esquina y un acento; en móvil, 8 más dos acentos. Como el generador tiene semilla fija, el SVG y el canvas ponen cada flor en el mismo sitio y el cruce entre ambos no «salta».
3. **`FlowerField` decide.** En el navegador comprueba: `prefers-reduced-motion`, WebGL **por hardware** (si el renderizador es SwiftShader, llvmpipe u otro emulador por software, se considera un dispositivo sin GPU), memoria (`deviceMemory` > 2 GB), núcleos (> 2), `saveData` y tipo de conexión (2G/3G). Si algo falla, se queda con el 2D y nunca descarga three.js.
4. **El 3D se descarga tarde a propósito.** Si procede, espera al evento `load` y después a la **primera interacción** (scroll, rueda, toque, tecla o movimiento del ratón con puntero fino) o, como máximo, a los 9 segundos. Solo entonces `next/dynamic` (con `ssr: false`) trae `FlowerCanvas`, y con él three.js, React Three Fiber, GSAP y ScrollTrigger (~190 KB comprimidos en un chunk aparte). Cuando el canvas está creado, el 2D se desvanece y el 3D aparece en su lugar. Nada de esto está en el JavaScript inicial de la página.
5. **ScrollTrigger escribe, `useFrame` lee.** `ScrollScenes` crea un ScrollTrigger sobre `<main>` (progreso 0–1 de toda la página) y uno por cada sección con `data-scene`. En cada actualización guarda los valores en `escena` y llama a `escena.invalidar()`. Dentro del canvas, `useFrame` lee `escena.global` en cada fotograma y lo suaviza con `MathUtils.damp`, así el movimiento es cinemático aunque el scroll sea brusco. Si el 3D se monta con la página ya desplazada, `onRefresh` lo sitúa en el punto correcto.
6. **Qué se anima con el scroll.** La cámara baja (`y = -progreso × 5,5`), lo que crea paralaje entre flores a distinta profundidad. Cada flor gira despacio, respira (los pétalos se abren y cierran un poco) y deriva con su propia velocidad. **El jardín es continuo:** cada flor se envuelve en un rango vertical de 1,7 alturas visibles (`rango = altoVisible × 1,7`), de modo que al bajar siempre entran flores nuevas por abajo y nunca se acaba el fondo, por larga que sea la página. Con ratón, la cámara responde al puntero.
7. **Pulso.** Cuando el usuario interactúa con algo relevante (por ejemplo, cambia de pestaña en «La experiencia»), el componente escribe `escena.pulso = performance.now()` y las flores hacen una apertura extra durante 1,4 s. Es la única forma de que la interfaz «hable» con el 3D, y no pasa por React.
8. **Ahorro.** Cuando el pie de página entra en pantalla, `escena.activo` pasa a `false` y el canvas cambia a `frameloop="demand"`: deja de dibujar hasta que se vuelve a subir.

## Por qué no bloquea el contenido

- El canvas es `position: fixed`, `z-index: 0` y `pointer-events: none`. Las secciones son `relative z-10`. El contenido se maqueta y pinta sin saber que existe el canvas.
- El scroll nunca provoca renders de React: `escena` es un objeto plano; nada pasa por `useState`.
- Toda la escena son **tres draw calls**: un `InstancedMesh` con todos los pétalos (exteriores e interiores), otro con los centros y otro con los ocho puntos que rodean cada flor, como en el isotipo. Actualizar unas 200 matrices por fotograma cuesta décimas de milisegundo.
- `dpr` máximo 1,5, sin sombras, sin postprocesado, sin texturas, materiales planos con colores por vértice para el sombreado.
- La entrada del hero es CSS (`@keyframes` con `animation-delay` escalonado): arranca en el primer pintado, no espera a ningún script y se desactiva con `prefers-reduced-motion`. El titular solo se desplaza; la foto se revela con `clip-path` y escala. Ninguno de los dos pasa por opacidad 0, porque el navegador retrasaría el LCP hasta que fuesen visibles.
- `petalo.ts` no importa three.js; la geometría vive en `petaloGeometria.ts`, que solo carga el chunk diferido. Así el fondo 2D no arrastra three.js al bundle inicial.

## Presupuesto

| Recurso | Peso | Cuándo llega |
|---|---|---|
| Modelos 3D | 0 KB (geometría generada por código) | — |
| three.js + React Three Fiber + GSAP + ScrollTrigger | ~190 KB gzip, un chunk | tras `load` y la primera interacción (o 9 s), solo si el dispositivo lo permite |
| JavaScript inicial de la página (React, Next, componentes) | ~185 KB gzip | con la página |
| Fondo 2D (SVG) | ~4 KB en el HTML | inmediato |

## Cómo añadir una sección que reaccione al scroll

1. Ponle `data-scene="nombre"` a la `<section>` y `className="relative z-10"`.
2. Si quieres que se vean las flores detrás, no le pongas fondo opaco; usa tarjetas `.glass`.
3. Si quieres que la escena haga algo distinto en esa sección, lee `escena.indice` y `escena.progreso` en `Flores.tsx` (por ejemplo, otra pose de cámara por índice).
4. Para un «pulso» desde un componente, escribe `escena.pulso = performance.now()` desde una función de módulo (no dentro del render), como hace `Experiencia.tsx`.

## Cómo cambiar las flores

- Dónde están y cuántas: `disposicion(movil)` en `petalo.ts`. Cambiar ahí mueve a la vez el SVG y el 3D.
- Tamaño: el campo `escala` que devuelve `disposicion` (y `diametroVh` para el SVG).
- Colores: `PALETAS` en `petalo.ts` (solo colores del kit y sus derivados).
- Forma del pétalo: `PETALO_SVG` (silueta 2D) y `crearGeometriaPetalo` en `petaloGeometria.ts` (curvatura en `z`, anchura).
- Velocidad de deriva y giro: constantes al principio de `Flores.tsx`; deriva del 2D en `.flor-2d` (`globals.css`).

## Medición (build de producción, Lighthouse móvil, 14 de septiembre de 2026)

| Modo | Rendimiento | LCP | TBT | CLS |
|---|---|---|---|---|
| Simulado (Lantern, como PageSpeed Insights) | 94 | 3,0 s | 40 ms | 0 |
| Red y CPU limitadas de verdad (DevTools) | 99 | 1,6 s | 20 ms | 0 |

El modo simulado es pesimista con el LCP de texto porque encadena todos los recursos descargados antes del titular; la medición con limitación real está muy por debajo de la meta de 2,5 s. La medición final de la fase e está en el README.
