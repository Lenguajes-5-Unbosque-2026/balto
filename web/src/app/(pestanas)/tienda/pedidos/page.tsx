import type { Metadata } from "next"
import { Suspense } from "react"

import { MisPedidos } from "@/components/tienda/pedidos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Mis pedidos · Balto" }

/** N9 · Mis pedidos y seguimiento. */
export default function Pagina() {
  return (
    <Suspense>
      <MisPedidos {...datosTienda()} />
    </Suspense>
  )
}
