import type { Metadata } from "next"
import { Suspense } from "react"

import { Vacunas } from "@/components/tienda/productos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Vacunas · Balto" }

/** N4 · Vacunas. */
export default function Pagina() {
  return (
    <Suspense>
      <Vacunas {...datosTienda()} />
    </Suspense>
  )
}
