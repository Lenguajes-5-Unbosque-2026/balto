import type { Metadata } from "next"
import { Suspense } from "react"

import { EditarEvento } from "@/components/consulta/editar-evento"
import {
  anticipacionAvisos,
  obtenerEventosDueno,
  obtenerMascotasBasicas,
  obtenerMediciones,
  obtenerVeterinarias,
} from "@/lib/datos"

export const metadata: Metadata = { title: "Editar evento · Balto" }

/** D6 · Editar evento (/evento/editar?id=e14). */
export default function EditarEventoPage() {
  return (
    <Suspense>
      <EditarEvento
        eventos={obtenerEventosDueno()}
        mascotas={obtenerMascotasBasicas()}
        mediciones={obtenerMediciones()}
        veterinarias={obtenerVeterinarias().map((v) => v.nombre)}
        anticipacion={anticipacionAvisos()}
      />
    </Suspense>
  )
}
