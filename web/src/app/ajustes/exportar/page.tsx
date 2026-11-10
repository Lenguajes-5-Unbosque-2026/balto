import type { Metadata } from "next"

import { ExportarDatos } from "@/components/cuenta/exportar-datos"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { cargarDatos, obtenerDueno, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Exportar mis datos · Balto" }

/** M6 · Exportar mis datos y M14 · Exportación lista. */
export default async function Pagina() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <ExportarDatos dueno={obtenerDueno()} mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} />
    </EmpezarDeCero>
  )
}
