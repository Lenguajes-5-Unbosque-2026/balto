import type { Metadata } from "next"
import { Suspense } from "react"

import { Escribenos } from "@/components/cuenta/escribenos"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { cargarDatos, obtenerDueno } from "@/lib/datos"

export const metadata: Metadata = { title: "Escríbenos · Balto" }

/** M19 · Escríbenos (/ajustes/escribenos?tema=problema). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <Suspense>
        <Escribenos dueno={obtenerDueno()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
