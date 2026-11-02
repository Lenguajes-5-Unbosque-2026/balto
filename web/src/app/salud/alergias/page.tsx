import type { Metadata } from "next"

import { AlergiasCondiciones } from "@/components/salud/alergias-condiciones"
import { obtenerCondiciones, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Alergias y condiciones · Balto" }

/** F5 · Alergias y condiciones. */
export default function AlergiasPage() {
  return <AlergiasCondiciones mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} condiciones={obtenerCondiciones()} />
}
