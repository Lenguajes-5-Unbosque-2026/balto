import type { Metadata } from "next"
import { Suspense } from "react"

import { VistaPublica } from "@/components/compartir/vista-publica"
import { obtenerDueno, obtenerEnvios, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Perfil de salud · Balto", robots: { index: false } }

/** Los enlaces de data/mock/ se generan al compilar; los creados en el navegador se resuelven al abrirlos. */
export function generateStaticParams() {
  return obtenerEnvios()
    .filter((e) => e.token)
    .map((e) => ({ token: e.token }))
}

/** L5 · Vista pública del perfil y L6 · Enlace expirado (balto.app/p/<token>). */
export default function EnlacePage({ params }: PageProps<"/p/[token]">) {
  return (
    <Suspense>
      <Vista params={params} />
    </Suspense>
  )
}

async function Vista({ params }: Pick<PageProps<"/p/[token]">, "params">) {
  const { token } = await params
  return <VistaPublica token={token} mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} envios={obtenerEnvios()} dueno={obtenerDueno()} />
}
