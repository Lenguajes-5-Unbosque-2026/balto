import type { Metadata } from "next"

import { EvolucionPeso } from "@/components/salud/evolucion-peso"
import { obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Evolución del peso · Balto" }

/** F4 · Evolución del peso. */
export default function PesoPage() {
  return <EvolucionPeso mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} />
}
