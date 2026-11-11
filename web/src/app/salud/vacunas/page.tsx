import type { Metadata } from "next"
import { Suspense } from "react"

import { CarnetVacunas } from "@/components/salud/carnet-vacunas"
import { cargarDatos, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Carnet de vacunas · Balto" }

/** F2 · Carnet de vacunas (/salud/vacunas?pestana=desparasitacion abre la otra pestaña). */
export default async function VacunasPage() {
  await cargarDatos()
  return (
    <Suspense>
      <CarnetVacunas mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} />
    </Suspense>
  )
}
