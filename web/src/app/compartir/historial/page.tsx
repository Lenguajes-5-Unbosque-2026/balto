import type { Metadata } from "next"

import { HistorialEnvios } from "@/components/compartir/historial-envios"
import { cargarDatos, obtenerEnvios, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Lo que compartí · Balto" }

/** L8 · Lo que compartí. */
export default async function HistorialPage() {
  await cargarDatos()
  return <HistorialEnvios mascotas={obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))} envios={obtenerEnvios()} />
}
