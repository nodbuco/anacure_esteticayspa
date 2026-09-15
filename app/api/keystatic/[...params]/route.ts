import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

const manejador = makeRouteHandler({ config });

/**
 * Detrás del proxy, el servidor de Next ve la petición como `http://0.0.0.0:3000/...`, y Keystatic
 * construye con ese origen el `redirect_uri` que manda a GitHub, que lo rechaza por no coincidir
 * con la GitHub App. En producción rehacemos la URL sobre el dominio público del sitio.
 * En desarrollo la petición se deja intacta, para que el login local siga funcionando.
 */
function conOrigenPublico(peticion: Request): Request {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV !== "production" || !base) return peticion;

  const actual = new URL(peticion.url);
  const destino = new URL(`${actual.pathname}${actual.search}${actual.hash}`, base);
  if (destino.href === actual.href) return peticion;

  const sinCuerpo = peticion.method === "GET" || peticion.method === "HEAD";
  return new Request(destino, {
    method: peticion.method,
    headers: peticion.headers,
    body: sinCuerpo ? undefined : peticion.body,
    ...(sinCuerpo ? {} : { duplex: "half" }),
  } as RequestInit);
}

export function GET(peticion: Request) {
  return manejador.GET(conOrigenPublico(peticion));
}

export function POST(peticion: Request) {
  return manejador.POST(conOrigenPublico(peticion));
}
