import type { Metadata } from "next"
import { Suspense } from "react"

import { AvisoToma } from "@/components/medicamentos/aviso-toma"
import { cargarDatos } from "@/lib/datos"
import { datosMedicamentos, mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Recordatorio de toma · Balto" }

/** G5 · Recordatorio de toma (/medicamentos/aviso?id=t04). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <AvisoToma mascotas={mascotasMedicamentos()} {...datosMedicamentos()} />
    </Suspense>
  )
}
