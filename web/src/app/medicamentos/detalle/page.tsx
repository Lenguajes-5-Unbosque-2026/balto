import type { Metadata } from "next"
import { Suspense } from "react"

import { DetalleTratamiento } from "@/components/medicamentos/detalle-tratamiento"
import { cargarDatos } from "@/lib/datos"
import { datosMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Tratamiento · Balto" }

/** G2 · Detalle de tratamiento (/medicamentos/detalle?id=t04). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <DetalleTratamiento {...datosMedicamentos()} />
    </Suspense>
  )
}
