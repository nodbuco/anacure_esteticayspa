import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker/Coolify: genera .next/standalone con lo mínimo para correr en producción.
  output: "standalone",
  // Raíz explícita: evita que Turbopack suba a la carpeta de usuario buscando lockfiles.
  turbopack: { root: path.resolve() },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },
  // Cabeceras de seguridad básicas; la CSP completa llega en la fase e.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
