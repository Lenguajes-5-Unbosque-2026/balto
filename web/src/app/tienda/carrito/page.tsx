import type { Metadata } from "next"
import { Suspense } from "react"

import { Carrito } from "@/components/tienda/carrito"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Carrito · Balto" }

/** N6 · Carrito y N10 · Carrito vacío. */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <Carrito {...datosTienda()} />
    </Suspense>
  )
}
