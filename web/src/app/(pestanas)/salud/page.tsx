import type { Metadata } from "next"

import { PanelSalud } from "@/components/salud/panel-salud"
import { obtenerCondiciones, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Salud · Balto" }

/** F1 · Panel de salud. Se abre desde Accesos rápidos › Salud. */
export default function SaludPage() {
  return <PanelSalud mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} condiciones={obtenerCondiciones()} />
}
