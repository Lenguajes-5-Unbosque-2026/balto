import type { Metadata } from "next"

import { PanelSalud } from "@/components/salud/panel-salud"
import { cargarDatos, obtenerCondiciones, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Salud · Balto" }

/** F1 · Panel de salud. Se abre desde Accesos rápidos › Salud. */
export default async function SaludPage() {
  await cargarDatos()
  return <PanelSalud mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} condiciones={obtenerCondiciones()} />
}
