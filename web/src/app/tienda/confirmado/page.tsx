import type { Metadata } from "next"
import { Suspense } from "react"

import { PedidoConfirmado } from "@/components/tienda/pedidos"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Pedido confirmado · Balto" }

/** N8 · Pedido confirmado (/tienda/confirmado?id=…). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <PedidoConfirmado {...datosTienda()} />
    </Suspense>
  )
}
