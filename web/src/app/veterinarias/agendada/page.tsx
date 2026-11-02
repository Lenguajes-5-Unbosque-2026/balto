import type { Metadata } from "next"
import { Suspense } from "react"

import { CitaAgendada } from "@/components/proveedores/citas"
import { datosProveedores } from "@/lib/proveedores-servidor"

export const metadata: Metadata = { title: "Cita agendada · Balto" }

/** K9 · Cita agendada (/veterinarias/agendada?id=…). */
export default function Pagina() {
  return (
    <Suspense>
      <CitaAgendada {...datosProveedores()} />
    </Suspense>
  )
}
