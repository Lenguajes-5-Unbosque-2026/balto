import type { Metadata } from "next"
import { Suspense } from "react"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { AgendarCita } from "@/components/proveedores/agendar-cita"
import { cargarDatos } from "@/lib/datos"
import { datosProveedores } from "@/lib/proveedores-servidor"

export const metadata: Metadata = { title: "Agendar cita · Balto" }

/** K5 · Agendar cita y K10 · Sin horarios (/veterinarias/agendar?id=v01; ?cita=ci03 reprograma). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <Suspense>
        <AgendarCita {...datosProveedores()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
