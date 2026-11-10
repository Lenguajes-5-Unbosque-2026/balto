import type { Metadata } from "next"
import { Suspense } from "react"

import { Alimentos } from "@/components/tienda/alimentos"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Alimentos · Balto" }

/** N2 · Alimentos y N11 · Búsqueda sin resultados (/tienda/alimentos?q=…). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <Alimentos {...datosTienda()} />
    </Suspense>
  )
}
