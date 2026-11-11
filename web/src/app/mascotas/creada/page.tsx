import type { Metadata } from "next"
import { Suspense } from "react"

import { PerfilCreado } from "@/components/mascota/cedula-mascota"
import { cargarDatos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Perfil creado · Balto" }

/** B5 · Perfil creado (/mascotas/creada?id=…). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <PerfilCreado mascotas={obtenerMascotas()} />
    </Suspense>
  )
}
