import type { Metadata } from "next"
import { Suspense } from "react"

import { Urgencia } from "@/components/alimentacion/urgencia"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { obtenerEventosDueno, obtenerPerfiles, obtenerVeterinarias } from "@/lib/datos"

export const metadata: Metadata = { title: "Urgencia · Balto" }

/** H6 · Urgencia (ya lo comió) y H7 · Llamando a la veterinaria (/alimentacion/urgencia?alimento=Uvas). */
export default function UrgenciaPage() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <Urgencia mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} veterinarias={obtenerVeterinarias()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
