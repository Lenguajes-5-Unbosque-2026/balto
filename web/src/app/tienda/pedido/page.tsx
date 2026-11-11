import type { Metadata } from "next"
import { Suspense } from "react"

import { DetallePedido } from "@/components/tienda/pedidos"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Pedido · Balto" }

/** N15 · Detalle del pedido (/tienda/pedido?id=…). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <DetallePedido {...datosTienda()} />
    </Suspense>
  )
}
