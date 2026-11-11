import type { Metadata } from "next"
import { Suspense } from "react"

import { CedulaMascota } from "@/components/mascota/cedula-mascota"
import { cargarDatos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Cédula · Balto" }

/** B6 · Cédula de la mascota (/mascotas/cedula?id=…). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <CedulaMascota mascotas={obtenerMascotas()} />
    </Suspense>
  )
}
