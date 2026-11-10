import type { Metadata } from "next"
import { Suspense } from "react"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { DetalleAlimento } from "@/components/tienda/productos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Detalle · Balto" }

/** N3 · Detalle de alimento (/tienda/producto?id=pr01). */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <DetalleAlimento {...datosTienda()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
