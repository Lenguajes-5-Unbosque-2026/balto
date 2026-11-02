import type { Metadata } from "next"
import { Suspense } from "react"

import { CalendarioCitas } from "@/components/proveedores/citas"
import { datosProveedores } from "@/lib/proveedores-servidor"

export const metadata: Metadata = { title: "Calendario · Balto" }

/** K6 · Calendario unificado. */
export default function Pagina() {
  return (
    <Suspense>
      <CalendarioCitas {...datosProveedores()} />
    </Suspense>
  )
}
