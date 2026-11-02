import type { Metadata } from "next"
import { Suspense } from "react"

import { DetalleCita } from "@/components/proveedores/citas"
import { datosProveedores } from "@/lib/proveedores-servidor"

export const metadata: Metadata = { title: "Cita · Balto" }

/** K11 · Detalle de la cita (/veterinarias/cita?id=ci03). */
export default function Pagina() {
  return (
    <Suspense>
      <DetalleCita {...datosProveedores()} />
    </Suspense>
  )
}
