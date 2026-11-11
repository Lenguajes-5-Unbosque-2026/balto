import type { Metadata } from "next"
import { Suspense } from "react"

import { EditarMascota } from "@/components/cuenta/editar-mascota"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { cargarDatos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Editar mascota · Balto" }

/** M18 · Editar mascota y M13 · Archivar (/ajustes/mascotas/editar?id=m01). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <Suspense>
        <EditarMascota mascotas={obtenerMascotas()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
