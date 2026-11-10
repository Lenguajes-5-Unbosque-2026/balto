import type { Metadata } from "next"
import { Suspense } from "react"

import { PedidoConfirmado } from "@/components/tienda/pedidos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Pedido confirmado · Balto" }

/** N8 · Pedido confirmado (/tienda/confirmado?id=…). */
export default function Pagina() {
  return (
    <Suspense>
      <PedidoConfirmado {...datosTienda()} />
    </Suspense>
  )
}
