import type { Metadata } from "next"

import { PlanAlimentacion } from "@/components/alimentacion/plan-alimentacion"
import { datosAlimentacion } from "@/lib/alimentacion-servidor"
import { cargarDatos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Alimentación · Balto" }

/** H1 · Plan de alimentación. Se abre desde Accesos rápidos › Alimentación. */
export default async function AlimentacionPage() {
  await cargarDatos()
  return <PlanAlimentacion mascotas={obtenerMascotas()} {...datosAlimentacion()} />
}
