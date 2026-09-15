# Imagen de producción del sitio (Next.js en modo standalone).
# Coolify la construye sola a partir de este archivo. Ver docs/despliegue.md.

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Dependencias exactas del package-lock
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 2. Build. Las variables NEXT_PUBLIC_* quedan incrustadas en el JavaScript del navegador,
#    por eso deben llegar como argumentos de build (en Coolify: variable marcada «Build»).
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://anacure.co
ARG NEXT_PUBLIC_PLAUSIBLE_HOST=
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN=anacure.co
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_PLAUSIBLE_HOST=$NEXT_PUBLIC_PLAUSIBLE_HOST \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Imagen final: solo lo necesario para correr (≈ 150 MB)
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    TZ=America/Bogota
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null 2>&1 || exit 1
CMD ["node", "server.js"]
