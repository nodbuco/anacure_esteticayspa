# Cómo funciona la animación 3D con scroll

Documento para quien mantenga el sitio. Explica qué hace cada archivo y por qué el 3D nunca frena la página.

## Las piezas

| Archivo | Qué hace |
|---|---|
| `lib/escenas.ts` | Un objeto compartido (`escena`) con el progreso del scroll, la sección activa, el puntero y si el canvas debe seguir dibujando. |
| `components/motion/ScrollScenes.tsx` | Crea los ScrollTrigger de GSAP y **escribe** en `escena`. No toca React. |
| `components/three/FlowerField.tsx` | Decide si hay 3D (o solo 2D) y cuándo montarlo. Pinta siempre el fondo 2D. |
| `components/three/FlowerFallback.tsx` | Las flores en SVG. Existen en el HTML desde el primer byte; se desplazan con CSS `animation-timeline: scroll()`. |
| `components/three/FlowerCanvas.tsx` | El `<Canvas>` de React Three Fiber: luces, niebla y ajustes de rendimiento. |
| `components/three/Flores.tsx` | Genera las flores, las dibuja con instancias y las anima en `useFrame` leyendo `escena`. |
| `components/three/petalo.ts` | Geometría procedural del pétalo (silueta de hoja del isotipo), paleta y generador determinista. |
| `components/home/Hero.tsx` | Hero. Su animación de entrada es CSS puro (clases `.entrada-*` en `globals.css`), sin JavaScript. |

## El flujo, paso a paso

1. **El HTML llega completo.** El hero (titular, texto, botones, foto) y el fondo 2D en SVG se renderizan en el servidor. El titular es el elemento LCP y no depende de ningún script.
2. **`FlowerField` decide.** En el navegador comprueba: `prefers-reduced-motion`, WebGL **por hardware** (si el renderizador es SwiftShader, llvmpipe u otro emulador por software, se considera un dispositivo sin GPU), memoria (`deviceMemory` > 2 GB), núcleos (> 2), `saveData` y tipo de conexión. Si algo falla, se queda con el 2D y nunca descarga three.js.
3. **El 3D se descarga tarde a propósito.** Si procede, espera al evento `load` y después a la **primera interacción** (scroll, rueda, toque, tecla o movimiento del ratón) o, como máximo, a los 5 segundos. Solo entonces `next/dynamic` (con `ssr: false`) trae `FlowerCanvas`, y con él three.js, React Three Fiber, GSAP y ScrollTrigger (~190 KB comprimidos en un chunk aparte). Cuando el canvas está creado, el 2D se desvanece en un segundo y el 3D aparece. Nada de esto está en el JavaScript inicial de la página.
4. **ScrollTrigger escribe, `useFrame` lee.** `ScrollScenes` (montado por `FlowerCanvas`) crea un ScrollTrigger sobre `<main>` (progreso 0–1 de toda la página) y uno por cada sección con `data-scene`. En cada actualización guarda los valores en `escena` y llama a `escena.invalidar()`. Dentro del canvas, `useFrame` lee `escena.global` en cada fotograma y lo suaviza con `MathUtils.damp`, así el movimiento es cinemático aunque el scroll sea brusco. Si el 3D se monta con la página ya desplazada, `onRefresh` lo sitúa en el punto correcto.
5. **Qué se anima con el scroll.** La cámara baja (`y = -progreso × 5,5`) y mira ligeramente hacia abajo, lo que crea paralaje entre flores a distinta profundidad. Cada flor gira (`fase + tiempo × giro + progreso × 0,75π`), se abre (los pétalos pasan de capullo a abiertos) y deriva hacia arriba con su propia velocidad (`deriva`). Con ratón, la cámara responde al puntero (±0,7 unidades).
6. **Vida propia sin scroll.** Un vaivén lento y una respiración de apertura dependen del tiempo, así que las flores nunca están del todo quietas.
7. **Ahorro.** Cuando el pie de página entra en pantalla, `escena.activo` pasa a `false` y el canvas cambia a `frameloop="demand"`: deja de dibujar hasta que se vuelve a subir.

## Por qué no bloquea el contenido

- El canvas es `position: fixed`, `z-index: 0` y `pointer-events: none`. Las secciones son `relative z-10`. El contenido se maqueta y pinta sin saber que existe el canvas.
- El scroll nunca provoca renders de React: `escena` es un objeto plano; nada pasa por `useState`.
- Toda la escena son **dos draw calls**: un `InstancedMesh` con todos los pétalos (17 flores × 6–8 pétalos) y otro con los centros. Actualizar 130 matrices por fotograma cuesta décimas de milisegundo.
- `dpr` máximo 1,5, sin sombras, sin postprocesado, sin texturas, materiales estándar con colores por vértice para el sombreado.
- La entrada del hero es CSS (`@keyframes` con `animation-delay` escalonado): arranca en el primer pintado, no espera a ningún script y se desactiva con `prefers-reduced-motion`. El titular solo se desplaza; la foto se revela con `clip-path` y escala. Ninguno de los dos pasa por opacidad 0, porque el navegador retrasaría el LCP hasta que fuesen visibles.
- `petalo.ts` (paleta, silueta SVG, generador) no importa three.js; la geometría vive en `petaloGeometria.ts`, que solo carga el chunk diferido. Así el fondo 2D no arrastra three.js al bundle inicial.

## Presupuesto

| Recurso | Peso | Cuándo llega |
|---|---|---|
| Modelos 3D | 0 KB (geometría generada por código) | — |
| three.js + React Three Fiber + GSAP + ScrollTrigger | ~190 KB gzip, un chunk | tras `load` y la primera interacción (o 5 s), solo si el dispositivo lo permite |
| JavaScript inicial de la página (React, Next, componentes) | ~185 KB gzip | con la página |
| Fondo 2D (SVG) | ~3 KB en el HTML | inmediato |

## Cómo añadir una sección que reaccione al scroll

1. Ponle `data-scene="nombre"` a la `<section>` y `className="relative z-10"`.
2. Si quieres que se vean las flores detrás, no le pongas fondo opaco; usa tarjetas `.glass`.
3. Si quieres que la escena haga algo distinto en esa sección, lee `escena.indice` y `escena.progreso` en `Flores.tsx` (por ejemplo, otra pose de cámara por índice).

## Cómo cambiar las flores

- Cantidad: `generarFlores` en `Flores.tsx` (`n = movil ? 11 : 17`).
- Tamaño: `escalaBase` en la misma función.
- Colores: `PALETA` en `petalo.ts` (solo colores del kit y sus derivados).
- Forma del pétalo: `crearGeometriaPetalo` en `petalo.ts` (curvatura en `z`, anchura en `semiAncho`).

## Medición (build de producción, Lighthouse móvil, 14 de septiembre de 2026)

| Modo | Rendimiento | LCP | TBT | CLS |
|---|---|---|---|---|
| Simulado (Lantern, como PageSpeed Insights) | 94 | 3,0 s | 40 ms | 0 |
| Red y CPU limitadas de verdad (DevTools) | 99 | 1,6 s | 20 ms | 0 |

El modo simulado es pesimista con el LCP de texto porque encadena todos los recursos descargados antes del titular; la medición con limitación real está muy por debajo de la meta de 2,5 s.
