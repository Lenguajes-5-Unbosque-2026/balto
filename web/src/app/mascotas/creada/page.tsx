import type { Metadata } from "next"
import { Suspense } from "react"

import { PerfilCreado } from "@/components/mascota/cedula-mascota"
import { obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Perfil creado · Balto" }

/** B5 · Perfil creado (/mascotas/creada?id=…). */
export default function Pagina() {
  return (
    <Suspense>
      <PerfilCreado mascotas={obtenerMascotas()} />
    </Suspense>
  )
}
