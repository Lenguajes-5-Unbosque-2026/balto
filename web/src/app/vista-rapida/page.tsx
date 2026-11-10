import type { Metadata } from "next"

import { VistaRapida } from "@/components/consulta/vista-rapida"
import { cargarDatos, obtenerDueno, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Vista rápida · Balto" }

/** D1 · Vista de acceso rápido de la mascota activa. Se abre con la flecha ↗ de Inicio. */
export default async function VistaRapidaPage() {
  await cargarDatos()
  return <VistaRapida mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} dueno={obtenerDueno()} />
}
