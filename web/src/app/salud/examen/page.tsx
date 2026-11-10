import type { Metadata } from "next"
import { Suspense } from "react"

import { DetalleExamen } from "@/components/salud/detalle-examen"
import { cargarDatos, obtenerEventosDueno } from "@/lib/datos"

export const metadata: Metadata = { title: "Examen · Balto" }

/** F7 · Detalle de examen (/salud/examen?id=e04). */
export default async function ExamenPage() {
  await cargarDatos()
  return (
    <Suspense>
      <DetalleExamen eventos={obtenerEventosDueno()} />
    </Suspense>
  )
}
