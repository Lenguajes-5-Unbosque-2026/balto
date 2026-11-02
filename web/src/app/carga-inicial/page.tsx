import type { Metadata } from "next"
import { Suspense } from "react"

import { CargaInicial } from "@/components/carga/carga-inicial"
import { obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Carga inicial · Balto" }

/** C1–C13 · Carga inicial de datos (/carga-inicial?mascota=m01). Se abre después de crear la mascota (B5). */
export default function CargaInicialPage() {
  return (
    <Suspense>
      <CargaInicial mascotas={obtenerPerfiles()} />
    </Suspense>
  )
}
