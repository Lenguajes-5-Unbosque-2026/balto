import type { Metadata } from "next"

import { DatosDueno } from "@/components/cuenta/datos-dueno"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { cargarDatos, obtenerDueno } from "@/lib/datos"

export const metadata: Metadata = { title: "Mis datos · Balto" }

/** M2 · Editar datos del dueño. */
export default async function Pagina() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <DatosDueno dueno={obtenerDueno()} />
    </EmpezarDeCero>
  )
}
