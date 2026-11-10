import type { Metadata } from "next"
import { Suspense } from "react"

import { CitaAgendada } from "@/components/proveedores/citas"
import { cargarDatos } from "@/lib/datos"
import { datosProveedores } from "@/lib/proveedores-servidor"

export const metadata: Metadata = { title: "Cita agendada · Balto" }

/** K9 · Cita agendada (/veterinarias/agendada?id=…). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <CitaAgendada {...datosProveedores()} />
    </Suspense>
  )
}
