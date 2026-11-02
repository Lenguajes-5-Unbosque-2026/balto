import type { Metadata } from "next"

import { ExportarDatos } from "@/components/cuenta/exportar-datos"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { obtenerDueno, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Exportar mis datos · Balto" }

/** M6 · Exportar mis datos y M14 · Exportación lista. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <ExportarDatos dueno={obtenerDueno()} mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} />
    </EmpezarDeCero>
  )
}
