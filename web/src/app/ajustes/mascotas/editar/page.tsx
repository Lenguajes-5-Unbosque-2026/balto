import type { Metadata } from "next"
import { Suspense } from "react"

import { EditarMascota } from "@/components/cuenta/editar-mascota"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Editar mascota · Balto" }

/** M18 · Editar mascota y M13 · Archivar (/ajustes/mascotas/editar?id=m01). */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <EditarMascota mascotas={obtenerMascotas()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
