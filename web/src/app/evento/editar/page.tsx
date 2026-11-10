import type { Metadata } from "next"
import { Suspense } from "react"

import { EditarEvento } from "@/components/consulta/editar-evento"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { anticipacionAvisos, cargarDatos, obtenerEventosDueno, obtenerMascotasBasicas, obtenerMediciones, obtenerVeterinarias } from "@/lib/datos"

export const metadata: Metadata = { title: "Editar evento · Balto" }

/** D6 · Editar evento (/evento/editar?id=e14). */
export default async function EditarEventoPage() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <Suspense>
        <EditarEvento
          eventos={obtenerEventosDueno()}
          mascotas={obtenerMascotasBasicas()}
          mediciones={obtenerMediciones()}
          veterinarias={obtenerVeterinarias().map((v) => v.nombre)}
          anticipacion={anticipacionAvisos()}
        />
      </Suspense>
    </EmpezarDeCero>
  )
}
