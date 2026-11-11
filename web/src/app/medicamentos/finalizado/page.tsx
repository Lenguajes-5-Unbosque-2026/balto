import type { Metadata } from "next"
import { Suspense } from "react"

import { TratamientoFinalizado } from "@/components/medicamentos/tratamiento-finalizado"
import { cargarDatos } from "@/lib/datos"
import { datosMedicamentos, mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Tratamiento finalizado · Balto" }

/** G9 · Tratamiento finalizado (/medicamentos/finalizado?id=t01). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <TratamientoFinalizado mascotas={mascotasMedicamentos()} {...datosMedicamentos()} />
    </Suspense>
  )
}
