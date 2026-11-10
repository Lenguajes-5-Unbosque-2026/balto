import type { Metadata } from "next"
import { Suspense } from "react"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { DetalleVacuna } from "@/components/tienda/productos"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Vacuna · Balto" }

/** N5 · Detalle de vacuna y aplicación (/tienda/vacuna?id=pr07&mascota=m01). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <Suspense>
        <DetalleVacuna {...datosTienda()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
