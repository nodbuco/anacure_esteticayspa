# Despliegue: Coolify, dominio y Cloudflare

El sitio corre como un contenedor en el VPS (`2.25.185.60`), gestionado por Coolify (`https://panel.nodbu.com`),
junto a n8n, Chatwoot y Easy!Appointments. El `Dockerfile` de la raíz construye la imagen; Coolify lo hace
solo cada vez que llega un commit a `main`.

## 1. Crear el recurso en Coolify

1. Proyecto → **+ New Resource** → *Public Repository* (o *GitHub App* si ya está instalada la app de
   Coolify en la cuenta `nodbuco`; con la app, el despliegue automático por push queda configurado solo).
2. Repositorio: `https://github.com/nodbuco/anacure_esteticayspa`, rama `main`.
3. **Build Pack: Dockerfile.** Puerto expuesto: `3000`.
4. Dominio: `https://anacure.co` (Coolify pide el certificado de Let's Encrypt a través de Traefik).
   Añade también `https://www.anacure.co` y activa la redirección a la raíz si Coolify la ofrece; si no,
   Cloudflare puede hacerla (paso 3).
5. **Variables de entorno** (pestaña *Environment Variables*):

   | Variable | Valor | Tipo |
   |---|---|---|
   | `EA_BASE_URL` | `https://spa.agenda.nodbu.com/index.php/api/v1` | runtime |
   | `EA_API_KEY` | el token de Easy!Appointments (Ajustes → Integraciones → API) | runtime, **secreto** |
   | `NEXT_PUBLIC_SITE_URL` | `https://anacure.co` | **Build variable** |
   | `NEXT_PUBLIC_PLAUSIBLE_HOST` | vacío hasta activar la analítica; luego `https://plausible.nodbu.com` | **Build variable** |
   | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `anacure.co` | **Build variable** |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | de la GitHub App del blog (paso 4) | runtime |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | ídem | runtime, **secreto** |
   | `KEYSTATIC_SECRET` | 32 caracteres aleatorios (`openssl rand -hex 32`) | runtime, **secreto** |

   Las `NEXT_PUBLIC_*` se incrustan en el JavaScript durante el build: en Coolify hay que marcarlas como
   *Build Variable* (o *Available at Buildtime*). Si se cambian, hay que volver a desplegar.
6. *Health check*: ruta `/robots.txt`, puerto 3000 (el `Dockerfile` ya trae un `HEALTHCHECK` equivalente).
7. **Deploy.** El primer build tarda 3–5 minutos. Después, cada push a `main` despliega solo (con la GitHub
   App) o con el botón *Redeploy*.

Dentro de la red `coolify`, `EA_BASE_URL` podría apuntar al nombre interno del contenedor de EA, pero la URL
pública con HTTPS funciona igual y evita depender de nombres internos que cambian al recrear el servicio.

## 2. Dominio en Hostinger

Mientras no se use Cloudflare, en el hPanel de Hostinger (DNS de `anacure.co`):

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `2.25.185.60` |
| CNAME | `www` | `anacure.co` |

Los cambios tardan de minutos a unas horas. Coolify emitirá el certificado en cuanto el dominio resuelva.

## 3. Cloudflare (recomendado, cuando se quiera)

1. Añadir el sitio `anacure.co` en Cloudflare (plan gratuito) y cambiar los *nameservers* del dominio en
   Hostinger por los que indique Cloudflare.
2. Registros DNS en Cloudflare: los mismos `A @` y `CNAME www` de arriba, **primero sin proxy (nube gris)**.
3. Esperar a que Coolify tenga el certificado (el sitio abre en `https://anacure.co` sin avisos).
4. Activar el proxy (nube naranja) en los dos registros y poner **SSL/TLS → Full (strict)**. Activar
   *Always Use HTTPS* y *Brotli*.
5. Regla de redirección `www.anacure.co/*` → `https://anacure.co/$1` (301), si no la hace Coolify.
6. Opcional: en *Caching → Cache Rules*, «Cache Everything» para `anacure.co/_next/static/*` (esos archivos
   llevan un hash en el nombre y ya salen con cabeceras inmutables).

Cloudflare no cachea el HTML por defecto, así que las citas y el blog se ven al instante tras cada despliegue.

## 4. Blog en producción: GitHub App para Keystatic

En desarrollo el editor (`/keystatic`) guarda los artículos en la carpeta `content/` del computador. En
producción escribe directamente en el repositorio de GitHub, y para eso necesita una GitHub App:

1. Con el proyecto corriendo en local (`npm run dev`), abre `http://localhost:3000/keystatic`. Como no hay
   credenciales, Keystatic muestra un asistente que **crea la GitHub App por ti** con las URL correctas.
   Si el asistente no aparece, sigue la guía de <https://keystatic.com/docs/github-mode>: la app necesita
   permisos *Contents: read & write* y *Pull requests: read & write* sobre el repositorio, *Callback URL*
   `https://anacure.co/api/keystatic/github/oauth/callback` (y la misma con `http://localhost:3000` para
   desarrollo) y *Homepage URL* `https://anacure.co`.
2. Instala la app en el repositorio `nodbuco/anacure_esteticayspa`.
3. Copia `Client ID`, `Client secret` y un `KEYSTATIC_SECRET` aleatorio a las variables de Coolify (tabla del
   paso 1) y vuelve a desplegar.
4. Entra en `https://anacure.co/keystatic`, inicia sesión con GitHub y publica. Cada artículo guardado es un
   commit; si se guarda en la rama `main`, Coolify redespliega y en unos minutos está en línea. Si se guarda
   en una rama nueva (Keystatic las crea con el prefijo `blog/`), hay que abrir y aprobar el *pull request*
   en GitHub para que salga.

## 5. Analítica (Plausible) cuando se active

1. En Coolify, **+ New Resource → Service → Plausible** (viene preconfigurado), con dominio
   `https://plausible.nodbu.com`.
2. En Plausible, añadir el sitio `anacure.co`.
3. En las variables del sitio, poner `NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.nodbu.com` y redesplegar.
   El script se carga solo cuando esa variable existe; hasta entonces el sitio no envía nada.

## 6. Volver atrás

En Coolify, la pestaña *Deployments* guarda los despliegues anteriores: *Redeploy* sobre uno viejo lo
restaura. El sitio no tiene base de datos propia: todo el contenido vive en git y las citas en Easy!Appointments.
