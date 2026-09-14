import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.nombre,
    short_name: SITE.nombreCorto,
    description: SITE.descripcion,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7FC",
    theme_color: "#8323AB",
    lang: "es-CO",
    icons: [
      { src: "/brand/icons/android-chrome-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icons/android-chrome-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
