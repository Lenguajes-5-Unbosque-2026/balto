import type { Metadata } from "next"
import { Suspense } from "react"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { EditarSalud } from "@/components/salud/editar-salud"
import { cargarDatos, obtenerCondiciones, obtenerPerfiles, obtenerVeterinarias } from "@/lib/datos"

export const metadata: Metadata = { title: "Editar alergias y condiciones · Balto" }

/** F6 · Editar alergias y condiciones (/salud/alergias/editar?condicion=c01). */
export default async function EditarAlergiasPage() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <Suspense>
        <EditarSalud mascotas={obtenerPerfiles()} condiciones={obtenerCondiciones()} veterinarias={obtenerVeterinarias().map((v) => v.nombre)} />
      </Suspense>
    </EmpezarDeCero>
  )
}
