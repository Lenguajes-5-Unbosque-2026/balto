import type { Metadata } from "next"
import { Suspense } from "react"

import { Carrito } from "@/components/tienda/carrito"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Carrito · Balto" }

/** N6 · Carrito y N10 · Carrito vacío. */
export default function Pagina() {
  return (
    <Suspense>
      <Carrito {...datosTienda()} />
    </Suspense>
  )
}
