import type { Metadata } from "next"

import { AvisoComida } from "@/components/alimentacion/aviso-comida"
import { datosAlimentacion } from "@/lib/alimentacion-servidor"
import { cargarDatos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Recordatorio de comida · Balto" }

/** H5 · Recordatorio de comida. */
export default async function AvisoComidaPage() {
  await cargarDatos()
  return <AvisoComida mascotas={obtenerMascotas()} {...datosAlimentacion()} />
}
