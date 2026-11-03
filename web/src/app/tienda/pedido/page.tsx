import type { Metadata } from "next"
import { Suspense } from "react"

import { DetallePedido } from "@/components/tienda/pedidos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Pedido · Balto" }

/** N15 · Detalle del pedido (/tienda/pedido?id=…). */
export default function Pagina() {
  return (
    <Suspense>
      <DetallePedido {...datosTienda()} />
    </Suspense>
  )
}
