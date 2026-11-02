import type { Metadata } from "next"
import { Suspense } from "react"

import { AvisoToma } from "@/components/medicamentos/aviso-toma"
import { datosMedicamentos, mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Recordatorio de toma · Balto" }

/** G5 · Recordatorio de toma (/medicamentos/aviso?id=t04). */
export default function Pagina() {
  return (
    <Suspense>
      <AvisoToma mascotas={mascotasMedicamentos()} {...datosMedicamentos()} />
    </Suspense>
  )
}
