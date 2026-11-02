import type { Metadata } from "next"

import { PlanAlimentacion } from "@/components/alimentacion/plan-alimentacion"
import { datosAlimentacion } from "@/lib/alimentacion-servidor"
import { obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Alimentación · Balto" }

/** H1 · Plan de alimentación. Se abre desde Accesos rápidos › Alimentación. */
export default function AlimentacionPage() {
  return <PlanAlimentacion mascotas={obtenerMascotas()} {...datosAlimentacion()} />
}
