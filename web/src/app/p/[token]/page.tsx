import type { Metadata } from "next"
import { Suspense } from "react"

import { VistaPublica } from "@/components/compartir/vista-publica"
import { cargarDatos, obtenerDueno, obtenerEnvios, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Perfil de salud · Balto", robots: { index: false } }

/** L5 · Vista pública del perfil y L6 · Enlace expirado (balto.app/p/<token>). */
export default async function EnlacePage({ params }: PageProps<"/p/[token]">) {
  await cargarDatos()
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
