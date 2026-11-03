import type { Metadata } from "next"
import { Suspense } from "react"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { Pago } from "@/components/tienda/pago"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Pago · Balto" }

/** N7 · Entrega y pago, con N12, N13, N14 y N16. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <Pago {...datosTienda()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
