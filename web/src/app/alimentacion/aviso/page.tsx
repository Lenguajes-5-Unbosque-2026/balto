import type { Metadata } from "next"

import { AvisoComida } from "@/components/alimentacion/aviso-comida"
import { datosAlimentacion } from "@/lib/alimentacion-servidor"
import { obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Recordatorio de comida · Balto" }

/** H5 · Recordatorio de comida. */
export default function AvisoComidaPage() {
  return <AvisoComida mascotas={obtenerMascotas()} {...datosAlimentacion()} />
}
