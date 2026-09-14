import { collection, config, fields } from "@keystatic/core";
import { PRODUCTOS } from "./data/productos";

/**
 * Keystatic: editor del blog para los dueños (sin tocar código).
 * - En desarrollo guarda en la carpeta content/ del proyecto.
 * - En producción (con las variables KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET y
 *   KEYSTATIC_SECRET definidas en Coolify) guarda en GitHub y cada artículo dispara un despliegue.
 */
// GitHub solo cuando existen las credenciales de la GitHub App (en Coolify); si no, local.
const enGitHub = Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID);

export default config({
  storage: enGitHub
    ? { kind: "github", repo: { owner: "nodbuco", name: "anacure_esteticayspa" }, branchPrefix: "blog/" }
    : { kind: "local" },
  ui: {
    brand: { name: "Ana Cure · Blog" },
    navigation: { Contenido: ["articulos"] },
  },
  collections: {
    articulos: collection({
      label: "Artículos del blog",
      slugField: "titulo",
      path: "content/blog/*",
      entryLayout: "content",
      format: { contentField: "contenido" },
      schema: {
        titulo: fields.slug({
          name: { label: "Título", description: "El título del artículo tal como se verá en la página." },
          slug: { label: "Dirección (URL)", description: "Se genera sola a partir del título. Solo letras, números y guiones." },
        }),
        resumen: fields.text({ label: "Resumen", description: "Dos o tres frases. Aparece en el listado y en Google.", multiline: true, validation: { length: { min: 40, max: 220 } } }),
        fecha: fields.date({ label: "Fecha de publicación", validation: { isRequired: true } }),
        categoria: fields.select({
          label: "Categoría",
          options: [
            { label: "Cuidado de la piel", value: "piel" },
            { label: "Tratamientos", value: "tratamientos" },
            { label: "Spa y bienestar", value: "bienestar" },
            { label: "Novedades", value: "novedades" },
          ],
          defaultValue: "piel",
        }),
        imagen: fields.image({
          label: "Imagen principal",
          description: "Horizontal, mínimo 1200 px de ancho. Se guarda en public/media/blog.",
          directory: "public/media/blog",
          publicPath: "/media/blog/",
        }),
        imagenAlt: fields.text({ label: "Descripción de la imagen", description: "Para personas con lector de pantalla y para Google." }),
        productos: fields.multiselect({
          label: "Productos relacionados",
          description: "Se muestran al final del artículo.",
          options: PRODUCTOS.map((p) => ({ label: `${p.nombre} · ${p.marca}`, value: p.slug })),
        }),
        publicado: fields.checkbox({ label: "Publicado", description: "Desmarca para guardar un borrador sin mostrarlo en la web.", defaultValue: true }),
        contenido: fields.markdoc({ label: "Contenido" }),
      },
    }),
  },
});
