import type { Metadata } from "next"
import { Suspense } from "react"

import { Escribenos } from "@/components/cuenta/escribenos"
import { obtenerDueno } from "@/lib/datos"

export const metadata: Metadata = { title: "Escríbenos · Balto" }

/** M19 · Escríbenos (/ajustes/escribenos?tema=problema). */
export default function Pagina() {
  return (
    <Suspense>
      <Escribenos dueno={obtenerDueno()} />
    </Suspense>
  )
}
