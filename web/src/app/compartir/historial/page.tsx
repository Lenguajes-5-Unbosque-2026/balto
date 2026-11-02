import type { Metadata } from "next"

import { HistorialEnvios } from "@/components/compartir/historial-envios"
import { obtenerEnvios, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Lo que compartí · Balto" }

/** L8 · Lo que compartí. */
export default function HistorialPage() {
  return <HistorialEnvios mascotas={obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))} envios={obtenerEnvios()} />
}
