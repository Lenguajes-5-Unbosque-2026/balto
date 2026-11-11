import type { Metadata } from "next"
import { Suspense } from "react"

import { MisPedidos } from "@/components/tienda/pedidos"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Mis pedidos · Balto" }

/** N9 · Mis pedidos y seguimiento. */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <MisPedidos {...datosTienda()} />
    </Suspense>
  )
}
