import type { Metadata } from "next"
import { Suspense } from "react"

import { NoSePudoGuardar } from "@/components/estados/estados"

export const metadata: Metadata = { title: "No se pudo guardar · Balto" }

/** O8 · No se pudo guardar. */
export default function Pagina() {
  return (
    <Suspense>
      <NoSePudoGuardar />
    </Suspense>
  )
}
