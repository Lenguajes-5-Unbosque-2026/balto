import type { Metadata } from "next"

import { LineaDeTiempo } from "@/components/consulta/linea-de-tiempo"
import { cargarDatos, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Línea de tiempo · Balto" }

/** D2 · Línea de tiempo de la mascota activa (con D3, D8, D9 y D10). */
export default async function LineaDeTiempoPage() {
  await cargarDatos()
  return <LineaDeTiempo mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} />
}
