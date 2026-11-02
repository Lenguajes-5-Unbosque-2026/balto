import type { Metadata } from "next"
import { Suspense } from "react"

import { DetalleTratamiento } from "@/components/medicamentos/detalle-tratamiento"
import { datosMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Tratamiento · Balto" }

/** G2 · Detalle de tratamiento (/medicamentos/detalle?id=t04). */
export default function Pagina() {
  return (
    <Suspense>
      <DetalleTratamiento {...datosMedicamentos()} />
    </Suspense>
  )
}
