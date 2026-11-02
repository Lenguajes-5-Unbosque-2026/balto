import type { Metadata } from "next"
import { Suspense } from "react"

import { TratamientoFinalizado } from "@/components/medicamentos/tratamiento-finalizado"
import { datosMedicamentos, mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Tratamiento finalizado · Balto" }

/** G9 · Tratamiento finalizado (/medicamentos/finalizado?id=t01). */
export default function Pagina() {
  return (
    <Suspense>
      <TratamientoFinalizado mascotas={mascotasMedicamentos()} {...datosMedicamentos()} />
    </Suspense>
  )
}
