# Sitio web · Ana Cure Estética & Spa

`https://anacure.co` · Dos sedes: El Banco (Magdalena) y Aguachica (Cesar).

Esta guía está pensada para los dueños del spa y para quien mantenga el sitio. La primera parte no
necesita saber programar. La segunda es técnica.

---

## Parte 1 · Para el equipo del spa

### Qué hace el sitio

- Presenta el spa, sus tratamientos, la experiencia, las sedes, los productos y un blog.
- Convierte visitas en citas de dos formas: **WhatsApp** (cada botón abre el chat de la sede con el mensaje
  ya escrito) y **Agendar** (`/agendar`), que crea la cita directamente en Easy!Appointments, el sistema de
  agenda del spa (`https://spa.agenda.nodbu.com`).
- Recuerda la sede que eligió cada persona en su navegador para no preguntársela dos veces.

### Publicar un artículo en el blog

1. Entra en `https://anacure.co/keystatic` e inicia sesión con GitHub (la cuenta con acceso al repositorio).
2. **Artículos → + Crear**. Llena título, resumen (dos líneas que salen en la lista), fecha, categoría, una
   imagen horizontal (ideal 1600 × 900 px, menos de 500 KB) con su descripción, y los productos
   relacionados si aplica.
3. Escribe el texto en el editor: títulos, negritas, listas, enlaces e imágenes.
4. Marca **Publicado** y pulsa **Guardar** eligiendo la rama `main`. En unos 5 minutos el artículo está en
   línea. Si lo guardas sin marcar «Publicado», queda como borrador y no se ve.

Los artículos viven en `content/blog/` y sus imágenes en `public/media/blog/`, dentro del repositorio.

### Cambiar textos, horarios y datos

Todo lo que se repite en el sitio está en la carpeta `data/`. Se editan como texto y, tras un push a
`main`, el sitio se actualiza solo.

| Qué | Archivo |
|---|---|
| Nombre, descripción, Instagram, datos legales (razón social, NIT, dirección, correo de habeas data) | `data/site.ts` |
| Direcciones, WhatsApp de cada sede, **horario** | `data/sedes.ts` |
| Tratamientos: nombre, categoría, resumen, descripción, duración, en qué sede, destacado en el home | `data/servicios.ts` |
| Secciones del home: insignias (antes y después), pasos de la experiencia, marcas, historias | `data/home.ts` |
| Equipo, títulos, trayectoria | `data/equipo.ts` (el equipo con `visible: false` no se muestra todavía) |
| Marcas y productos | `data/productos.ts` |
| Menú | `data/navegacion.ts`. El desplegable de «Servicios» se arma solo desde `data/servicios.ts`: por categoría, primero los `destacado: true` y hasta cinco |

Después de cambiar tratamientos u horario hay que correr `npm run ea:setup` para que Easy!Appointments
quede igual (ver Parte 2).

### Cambiar fotos

Las fotos están en `public/media/`. Para cambiar una, reemplaza el archivo **con el mismo nombre**:

- Retrato del hero: `public/media/hero/ana-cure.jpg` (vertical 3:4, 1500 × 2000 px).
- Sedes: `public/media/sedes/el-banco.jpg` y `aguachica.jpg` (horizontal 4:3).
- Antes y después: `public/media/insignias/*-antes.jpg` y `*-despues.jpg` (mismo encuadre las dos).
- Experiencia: `public/media/experiencia/*.jpg`.

Formato JPG, calidad 80–85, menos de 600 KB. El sitio genera solo las versiones AVIF/WebP y los tamaños.

### Promoción de la barra superior

La franja morada bajo la cabecera anuncia la promoción del mes, con el cupón (se copia con un toque) y
una cuenta regresiva de días y horas. Todo se cambia en `data/promociones.ts`:

- `ocasion`, `descuento`, `tratamiento` y `cupon`: los textos que se ven.
- `termina`: fecha y hora de cierre, con la zona de Colombia (`2026-10-01T00:00:00-05:00` = fin de septiembre).
  A esa hora la barra desaparece sola.
- `activa: false`: la quita antes de tiempo.

Tras cambiar el archivo hay que desplegar. La barra no es fija: se va con el scroll. Mientras existe,
el hero del inicio descuenta su alto para seguir ocupando la primera pantalla igual que sin ella.

### La agenda

- El equipo ve y gestiona las citas en el panel de Easy!Appointments:
  `https://spa.agenda.nodbu.com/index.php/backend`.
- Cada sede es un «proveedor» con su calendario. Los festivos de Colombia ya están bloqueados hasta 2028.
- Para cerrar por vacaciones: en el panel, Calendario → Periodo bloqueado.
- Cuando alguien reserva en la web, la cita aparece en el calendario de la sede con una nota
  «Reservado desde anacure.co» y el WhatsApp de la persona.
- Detalles, webhooks hacia n8n y Chatwoot y tareas frecuentes: [docs/agenda.md](docs/agenda.md).

### Pendientes que dependen del spa

- **Correo real** para habeas data (`correoDatos` en `data/site.ts`; hoy `datos@anacure.co`) y correos de las
  sedes en Easy!Appointments (hoy `el-banco@anacure.co` y `aguachica@anacure.co`, se cambian en el panel).
- **Correo saliente (SMTP)** para que Easy!Appointments mande confirmaciones por email.
- **Dominio de la clínica** (`urlClinica` en `data/site.ts`; hoy `clinica.anacure.co`).
- **Analítica**: activar Plausible cuando esté instalado (ver Parte 2).
- Fotos nuevas y video cuando se produzcan.

---

## Parte 2 · Técnica

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, React Three Fiber para el fondo
3D, GSAP ScrollTrigger para el scroll, Keystatic para el blog, Zod para validar la agenda.

### Correr en el computador

```bash
npm install
cp .env.example .env.local   # y pega el token de Easy!Appointments
npm run dev
```

Abre `http://localhost:3000`. Rutas útiles: `/estilo` (sistema de diseño, no indexada), `/keystatic`
(editor del blog en modo local), `/agendar` (agenda real contra Easy!Appointments).

```bash
npm run lint        # ESLint
npx tsc --noEmit    # tipos
npm run build && npm start
npm run ea:setup    # sincroniza Easy!Appointments con data/ (ver docs/agenda.md); -- --ver para simular
```

### Estructura

```
app/                 páginas (App Router), API de la agenda, sitemap, robots, manifest
  api/agenda/        disponibilidad (GET) y citas (POST): único lugar que habla con Easy!Appointments
components/          ui (botones, campos…), layout, home, agenda, three (3D), motion, sede, cta, analytics,
                     nodbu-firma (firma del desarrollador en el pie; no editar, se reemplaza entera)
data/                contenido editable: site, sedes, servicios, home, equipo, productos, navegacion
                     agenda.generated.json: ids de Easy!Appointments (lo escribe scripts/ea-setup.ts)
lib/                 agenda (reglas y validación), ea (cliente servidor), festivos, analytics, seo, whatsapp, blog
content/blog/        artículos (Keystatic, formato Markdoc)
public/brand         logos del kit · public/media fotos · public/og portada para redes
scripts/ea-setup.ts  configura Easy!Appointments desde data/
docs/                animacion-3d.md · agenda.md · despliegue.md
```

### Variables de entorno

Ver `.env.example`. `EA_API_KEY` solo se lee en el servidor (`lib/ea.ts` importa `server-only`); nunca
llega al navegador ni al repositorio. Las `NEXT_PUBLIC_*` se fijan en el build.

### Analítica

`lib/analytics.ts` expone `track(evento, props)`. Todos los componentes llaman a esa función y ninguno
conoce al proveedor. En desarrollo imprime en consola; en producción envía a Plausible si el script está
cargado, y si no, no hace nada.

| Evento | Cuándo | Props |
|---|---|---|
| `cta_whatsapp` | clic en cualquier botón de WhatsApp | `sede`, `ubicacion`, `servicio` |
| `cta_agendar` | clic en cualquier botón de agendar | `sede`, `ubicacion`, `servicio` |
| `sede_seleccionada` | la persona elige sede | `sede` |
| `vista_servicio` | se abre la página de un tratamiento | `servicio`, `categoria` |
| `cita_completada` | la cita quedó creada en Easy!Appointments | `sede`, `servicio` |
| `formulario_contacto` | envío del formulario «Escríbenos» de una sede | `sede`, `ubicacion` |
| `cupon_copiado` | se copia el cupón de la barra de promoción | `promocion`, `cupon` |

**Activar Plausible:** poner `NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.nodbu.com` (y el dominio en
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) y volver a desplegar. `components/analytics/PlausibleScript.tsx` solo
inserta el script cuando la variable existe. Los eventos personalizados hay que darlos de alta como
*Goals* en Plausible para verlos en el panel.

**Cambiar a GA4 (u otro):** se toca únicamente `lib/analytics.ts` (la función `track`) y el componente que
carga el script; el resto del sitio no cambia.

### Despliegue

Dockerfile multietapa (imagen `standalone`, usuario sin privilegios, `TZ=America/Bogota`, health check).
Coolify construye y publica en cada push a `main`. Pasos, variables, dominio, Cloudflare, GitHub App del
blog y Plausible: [docs/despliegue.md](docs/despliegue.md).

### SEO

Metadatos y `canonical` por página, Open Graph con `public/og/portada.jpg`, `sitemap.xml` y `robots.txt`
generados, datos estructurados `Organization` + `WebSite` (layout) y `HealthAndBeautyBusiness` por sede,
`manifest` e iconos. `/keystatic`, `/api` y `/estilo` no se indexan.

### Rendimiento

Objetivo: móvil 4G con LCP < 2,5 s, INP < 200 ms, CLS < 0,1 y Lighthouse ≥ 90. Cómo se logra con un fondo
3D: [docs/animacion-3d.md](docs/animacion-3d.md). Medición final en la sección siguiente.

### Medición final (Lighthouse móvil, build de producción, 14 de septiembre de 2026)

| Página | Modo | Rendimiento | LCP | TBT | CLS | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|---|---|---|---|
| Home | simulado (como PageSpeed) | 92 | 3,4 s | 40 ms | 0 | 100 | 100 | 100 |
| Home | limitación real (DevTools) | 99 | 1,7 s | 20 ms | 0,04 | 100 | 100 | 100 |
| /agendar | simulado | 93 | 3,2 s | 10 ms | 0 | 100 | 100 | 100 |
| /servicios/hydrafacial | simulado | 95 | 2,9 s | 10 ms | 0 | 100 | 100 | 100 |

El modo simulado (Lantern) es pesimista con el LCP de texto: encadena todos los recursos descargados antes
del titular. Con red y CPU limitadas de verdad, el LCP queda en 1,7 s, muy por debajo de la meta de 2,5 s.
