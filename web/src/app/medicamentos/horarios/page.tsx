import type { Metadata } from "next"
import { Suspense } from "react"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { EditarHorarios } from "@/components/medicamentos/editar-horarios"
import { datosMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Horarios de toma · Balto" }

/** G4 · Editar horarios o reactivar (/medicamentos/horarios?id=t04). */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <EditarHorarios {...datosMedicamentos()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
